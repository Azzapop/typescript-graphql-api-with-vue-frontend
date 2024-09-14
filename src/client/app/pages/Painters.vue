<script setup lang = "ts" >
import { computed } from 'vue';
import { usePainters } from './usePainters';

const result = await usePainters();

const painters = computed(() => result.result.value?.painters);
</script>
  < template >
  <div v -for= "painter in painters" >
    <p>{{ painter?.name }}</p>
      </div>
      </template>
