import { createRouter, createWebHashHistory } from 'vue-router'
import { Pages } from "@/router/pages"

const router = createRouter({
  history: createWebHashHistory(import.meta.env?.BASE_URL || '/'),
  routes: [
    {
      path: '/',
      name: Pages.home,  // 确保 Pages.home 是字符串（如 'home'）
      component: () => import('@/views/main.vue'),
       redirect: { name: Pages.discover } , // 确保 Pages.discover 是字符串
       children: [
        {
            path: 'discover',
            name: 'discover',
            component: () => import("@/views/discover/Discover.vue"),
            meta: {
                menu: 'discover',
                keepAlive: true,
            }
        },
        {
            path: 'music',
            name: 'music',
            component: () => import('@/views/music/Music.vue'),
            redirect: {name: 'picked'},
            meta: {
                menu: 'music'
            },
            children: [
                {
                    path: 'picked',
                    name: 'picked',
                    component: () => import("@/views/music/picked/Picked.vue"),
                    meta: {
                        menu: 'music',
                        keepAlive: true,
                    }
                },
                {
                    path: 'toplist',
                    name: 'toplist',
                    component: () => import("@/views/music/toplist/TopList.vue"),
                    meta: {
                        menu: 'music',
                        keepAlive: true,
                    }
                },
                {
                    path: 'artist',
                    name: 'artist',
                    component: () => import('@/views/music/artist/Artist.vue'),
                    meta: {
                        menu: 'music',
                        title: '歌手',
                        keepAlive: true,
                    }
                },
                {
                    path: Pages.category,
                    name: Pages.category,
                    component: () => import('@/views/music/category/Category.vue'),
                    meta: {
                        menu: 'music',
                        title: '分类歌单',
                        keepAlive: true,
                    }
                }
            ]
        },
        {
            path: 'playlist',
            name: 'playlist',
            component: () => import('@/views/playlist/PlayList.vue'),
        },
        {
            path: 'artistDetail',
            name: 'artistDetail',
            component: () => import('@/views/artist/ArtistDetail.vue'),
        },
        {
            path: 'album',
            name: 'album',
            component: () => import('@/views/album/Album.vue'),
        },
        {
            path: 'video',
            name: 'video',
            component: () => import('@/views/video/Video.vue'),
            meta: {
                menu: 'video',
                title: '视频',
                keepAlive: true,
            }
        },
        {
            path: 'dj',
            name: 'dj',
            component: () => import('@/views/dj/DJ.vue'),
            meta: {
                menu: 'dj',
                title: '电台',
                keepAlive: true,
            }
        },
        {
            path: Pages.mvDetail,
            name: Pages.mvDetail,
            component: () => import('@/views/mv/mvDetail.vue'),
        },
        {
            path: 'api-example',
            name: 'apiExample',
            component: () => import('@/views/api/ApiExample.vue'),
            meta: {
                menu: 'apiExample',
                title: 'API 示例',
                keepAlive: true,
            }
        }
    ],
    }
  ]
})

export default router
