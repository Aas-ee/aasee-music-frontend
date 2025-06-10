<template>
  <el-popover popper-style="max-width:auto;padding:0;" v-model:visible="showSearchView" width="250px">
    <template #reference>
      <ElInput placeholder="搜索音乐、MV、歌单"
               :prefix-icon="Search"
               clearable
               />
    </template>
  </el-popover>
</template>

<!-- <script setup lang="ts">
import {Search} from '@icon-park/vue-next'
import {storeToRefs} from "pinia";
import {useSearchStore} from "@/stores/search";
import {onMounted, ref} from "vue";
import type {SearchHotDetail} from "@/models/search";
import {useSearchHotDetail} from "@/utils/api";

import {debounce} from 'lodash'
import SearchSuggest from "@/components/layout/header/SearchSuggest.vue";

const {showSearchView, searchKeyword, showHot} = storeToRefs(useSearchStore())
const {suggest} = useSearchStore()

const hotClick = (text: string) => {
  searchKeyword.value = text
  suggest()
  showSearchView.value = true
}

const searchInput = debounce((value: string | number) => suggest(), 500, {'maxWait': 1000})

const searchHot = ref<SearchHotDetail[]>([])
onMounted(async () => {
  searchHot.value = await useSearchHotDetail()
})

</script>
<style lang="scss">

</style> -->
