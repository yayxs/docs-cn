import { data as features } from '../features/index.data.js'
import { Advanced, Guides } from './pages'

function removeHash(link: string) {
  const idx = link.lastIndexOf('#')
  return idx < 0 ? link : link.slice(0, idx)
}

function getGuideTitle(id: string) {
  return Guides.find(g => g.link.endsWith(id))?.text ?? Advanced.find(g => g.link.endsWith(id))?.text ?? id
}

export function resolveLink(link: string): {
  kind: 'external' | 'feature' | 'guide'
  url: string
  title?: string
  tags?: string[]
  descripton?: string
} {
  const [kind, nameWithHash] = link.split('/')
  const name = removeHash(nameWithHash)
  switch (kind) {
    case 'http:':
    case 'https:':
    case 'mailto:':
      return { kind: 'external', url: link }
    case 'feature': {
      const feature = features[name]
      if (!feature)
        throw new Error(`Feature "${name}" not found.`)
      return {
        kind: 'feature',
        title: `✨ ${feature.title}`,
        tags: feature.tags,
        descripton: feature.description,
        url: `/features/${nameWithHash}`,
      }
    }
    case 'guide': {
      return {
        kind: 'guide',
        title: `📘 ${getGuideTitle(name)}`,
        tags: ['指南'],
        descripton: '点击阅读该指南',
        url: `/guide/${nameWithHash}`,
      }
    }
    default:
      throw new Error(`Invalid link: ${link}`)
  }
}
