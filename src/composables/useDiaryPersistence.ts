import { ref, watch } from 'vue'
import { useDiaryStore } from '../stores/diary.store'
import { saveDiary } from '../services/diaryStorage'

export function useDiaryPersistence() {
  const diary = useDiaryStore()
  const storageError = ref(false)

  watch(
    () => ({ trips: diary.trips, profile: diary.profile }),
    (data) => {
      storageError.value = !saveDiary(data)
    },
    { deep: true },
  )

  return { storageError }
}
