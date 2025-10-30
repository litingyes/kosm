import type { AIMessage, AIMessageChunk } from '@langchain/core/messages'
import { HumanMessage } from '@langchain/core/messages'
import { ChatOpenAI } from '@langchain/openai'
import { cloneDeep } from 'es-toolkit'

export interface ChatModel {
  model?: string
  prompt?: string
}

export interface DefaultChatModel extends ChatModel {
  provider: 'default'
}

export interface OpenAIChatModel extends ChatModel {
  provider: 'openai'
  apiKey: string
  baseURL?: string
}

export interface AiChatOptions {
  model?: DefaultChatModel | OpenAIChatModel
}

export type AiChatMessage = HumanMessage | AIMessage

export function useAiChat(options?: AiChatOptions) {
  const config = useRuntimeConfig()

  const chatModel = shallowRef<DefaultChatModel | OpenAIChatModel>(options?.model
    ? cloneDeep(options.model)
    : {
        provider: 'default',
      })

  const model = shallowRef<ChatOpenAI>()
  if (chatModel.value.provider === 'default') {
    model.value = new ChatOpenAI({
      model: config.public.defaultModel,
      configuration: {
        apiKey: '',
        baseURL: `${location?.origin || 'http://localhost:7000'}/api/ai`,
      },
    })
  }
  else {
    model.value = new ChatOpenAI({
      model: chatModel.value.model,
      apiKey: chatModel.value.apiKey,
      configuration: {
        baseURL: chatModel.value.baseURL,
      },
    })
  }

  const messages = shallowRef<Array<AiChatMessage>>([])

  const status = ref<'error' | 'submitted' | 'streaming' | 'ready'>('ready')
  const abortController = shallowRef<AbortController | null>(null)
  const send = async (question: string) => {
    status.value = 'submitted'

    const humanMessage = new HumanMessage([
      {
        type: 'text',
        text: question,
      },
    ])

    messages.value.push(humanMessage)

    abortController.value = new AbortController()

    try {
      for await (const chunk of await model.value!.stream(messages.value, {
        signal: abortController.value!.signal,
      })) {
        status.value = 'streaming'

        const lastMessage = messages.value[messages.value.length - 1]!

        if (!lastMessage || lastMessage.type !== 'ai') {
          messages.value.push(chunk)
        }
        else {
          messages.value[messages.value.length - 1] = (lastMessage as AIMessageChunk).concat(chunk)
        }

        triggerRef(messages)
      }

      status.value = 'ready'
    }
    catch (error) {
      console.error(error)
      status.value = 'error'
    }
    finally {
      const lastMessage = messages.value[messages.value.length - 1]!
      if (lastMessage.type === 'human') {
        lastMessage.id = crypto.randomUUID()
      }
      else {
        humanMessage.id = lastMessage.id
      }
    }
  }
  const stop = () => {
    if (!abortController.value) {
      return
    }

    abortController.value.abort()
    abortController.value = null

    status.value = 'ready'
  }

  return {
    model,
    messages,

    status,
    send,
    stop,
  }
}
