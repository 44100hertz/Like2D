import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Like2D',
  description: 'A web-native game framework inspired by Love2D',
  base: '/like2d/',
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/callbacks' },
      { text: 'API Reference', link: '/api/' },
    ],
    
    sidebar: {
      '/callbacks': [
        {
          text: 'Documentation',
          items: [
            { text: 'Callbacks', link: '/callbacks' },
          ]
        },
        {
          text: 'Adapters',
          items: [
            { text: 'Callback Adapter', link: '/adapters/callback' },
            { text: 'Scene Adapter', link: '/adapters/scene' },
          ]
        }
      ],
      '/adapters/': [
        {
          text: 'Documentation',
          items: [
            { text: 'Callbacks', link: '/callbacks' },
          ]
        },
        {
          text: 'Adapters',
          items: [
            { text: 'Callback Adapter', link: '/adapters/callback' },
            { text: 'Scene Adapter', link: '/adapters/scene' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'Documentation',
          items: [
            { text: 'Callbacks', link: '/callbacks' },
          ]
        },
        {
          text: 'Adapters',
          items: [
            { text: 'Callback Adapter', link: '/adapters/callback' },
            { text: 'Scene Adapter', link: '/adapters/scene' },
          ]
        },
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Callback Adapter API', link: '/api/adapters/callback' },
            { text: 'Scene Adapter API', link: '/api/adapters/scene' },
            { text: 'Core Types', link: '/api/index/README' },
          ]
        },
        {
          text: 'Namespaces',
          items: [
            { text: 'Vec2', link: '/api/index/namespaces/Vec2' },
            { text: 'Rect', link: '/api/index/namespaces/Rect' },
            { text: 'GP', link: '/api/index/namespaces/GP' },
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/44100hertz/like2d' }
    ],
    
    search: {
      provider: 'local'
    }
  },
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/like2d/logo-icon.svg' }]
  ]
})
