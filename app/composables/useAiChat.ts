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

  const messages = ref<Array<HumanMessage | AIMessage>>([])
  const lastMessage = computed(() => {
    if (!messages.value.length) {
      return null
    }

    return messages.value[messages.value.length - 1]
  })

  const loading = ref(false)
  const send = async (question: string) => {
    messages.value.push(new HumanMessage(question))

    loading.value = true

    for await (const chunk of await model.value!.stream(question)) {
      if (!lastMessage.value || lastMessage.value.type !== 'ai') {
        messages.value.push(chunk)
      }
      else {
        messages.value[messages.value.length - 1] = (lastMessage.value as AIMessageChunk).concat(chunk)
      }
    }

    loading.value = false
  }

  return {
    model,
    messages,

    loading,
    send,
  }
}
