<script setup lang="ts">
import type { Code, Html } from 'mdast'
import { BlockCodeHighlight } from '#components'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { toVNode } from 'mdast-util-to-vnode'
import { gfm } from 'micromark-extension-gfm'

const props = withDefaults(defineProps<{
  content?: string
  stream?: boolean
}>(), {
  content: '',
  stream: true,
})

const contentRendered = ref('')
watchEffect(() => {
  if (!props.stream) {
    contentRendered.value = props.content

    return
  }

  if (!props.content?.length) {
    contentRendered.value = ''

    return
  }

  if (props.content.startsWith(contentRendered.value)) {
    requestAnimationFrame(() => {
      contentRendered.value += props.content.slice(contentRendered.value.length, contentRendered.value.length + Math.max(1, Math.ceil((props.content.length - contentRendered.value.length) / 10)))
    })

    return
  }

  contentRendered.value = props.content
}, {
  flush: 'post',
})

const vNode = computed(() => {
  return toVNode(
    fromMarkdown(
      contentRendered.value,
      {
        extensions: [gfm()],
        mdastExtensions: [gfmFromMarkdown()],
      },
    ),
    {
      components: {
        code: (node: Code) => [
          BlockCodeHighlight,
          {
            value: node.value,
            lang: node.lang,
          },
        ],
        html: (node: Html) => [
          BlockCodeHighlight,
          {
            value: node.value,
            lang: 'html',
          },
        ],
      },
    },
  )
})
</script>

<template>
  <div>
    <component :is="vNode" />
  </div>
</template>
