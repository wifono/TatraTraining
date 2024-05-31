<template>
  <div id="wrap">
    <div class="tb-head">
      <div class="heading" style="display: flex; align-items: center; justify-content: flex-start">
        <img
          class="hashtag"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAApCAYAAAChi6CMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUMzOEI1RjlDM0VEMTFFOUFFMTBENEU2QzJGNURBQjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUMzOEI1RkFDM0VEMTFFOUFFMTBENEU2QzJGNURBQjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmRpZDpBQzM4QjVGN0MzRUQxMUU5QUUxMEQ0RTZDMkY1REFCMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBQzM4QjVGOEMzRUQxMUU5QUUxMEQ0RTZDMkY1REFCMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgSPA7YAAAO+SURBVHjazFhpSFRRFJ73ssXKFtqgBLVogWiBNiKpoCikMhKkhGiBokhIKRtlyjZI0bKVAqOghUL6U7+C+llIFLSQbVrBiBFEu6VN4jh9J+7AcDnvvjsz79ZcOBy9531zv/e9c+5m+Qy2cVnZQ+FaYMOlUMPb1mCRApcG1wSbJIXuwebZPrNtH0P4F2yXC24bQ5haKV42YhtUeSJcMROqxcDvFLhhcAeY0EXgHtAfJpU+BkuT+tqItAvuIGyI1NcBC0T/sQ2pnAeXx4TKoVanAjcZbgsTqgbuvTHSooiOMiEqogYX+HFYL6kvCKuL7TChNFdEEVgJFZHiZfPhFjMhP3Ch2A7LY5WpiN4wOUlFtEGB6wP3DDZeCt0BboH8vNdKc0X0M7aIHFoJQzgi+n3GSCuKqCq2iBjcSLg9TOg8cE84jBXnp89QPHIOtkjq+wibDwu5LEBy6vyGUVp8YJ7vtDQJp8O9hGX5/n/bqJseO1KE8EPYJUtD5dFi0zMgBUjnIs8bdZSuShHCtDNs9DF7A1nlqXArYd8dHhnEFHNYTHOqNpBZ+WiKa3d4vou2AEkvLnih6XCPmN8ogyJ1LunWLIjHtjPAFeuMncw8fYIh/Bp2SiPdZMLfYHt1B7YTVLlQzL8+RuUuBW4W3Dpurgbus+74VgKE+4k5O1sK3cbASxU4GosKaa4UegWbAmy3SaV3MoTDYi5XtTUM4b9rQDyE41ZaMWcriwi4/qL4MqXQTeCWxatavEpXM4S/wipdcH6GcLfG10mONNSa7VBE+6HWFwUuU5CW22ngmhMhbUkzwm7Fs5QaI5j+50I1p0ZXCGOYfpoeufMindTz8UI9StIi51ocfvxft7UgfEUnPfwpQvg+7KpreoicI5XTU4D0nOiFjJvStSlC+LIO4egurx521iF+GDZT6vsEK3IpPlqAljM7tULFTu5p0osL0iYX7i4T2gpF6hW4HLHM95VCdIdX7sUnsR0GtsVtj9yaxAFW1Y4whOmAesirPHJaXNbDZnD3E1ArrFB5IVwBEwoA1+4VaYsZOENM/KOk0HUMXKAgbItDwTQp9JjqQrVYeKF0gCFMRVTm8lubGcLRr9Pj5TRjSWqNhXvB5GQNBq5QqDxYfB15mb8G3Gqv50bboyKqZAiHYg+jRkiLIlrlUEQ/FCpPgNvOzfHABY2RxsB0nD/pcKNzQWOK6y310YVjjamlM6r0JjqnMfFSVRHhZZfArWBCFcB1mCIdvay5Absln/swcJvG3VoO099qcpPyR4ABAFfeJQM3d2nbAAAAAElFTkSuQmCC"
        />
        <span class="fs-60 bold">prirodzenenajlepsi</span>
      </div>
      <span class="fs-70 heading3"> majú dnes tieto školenia:</span>
    </div>
    <div class="tb-logo">
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAAAyCAYAAACzklJdAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTgxMzVDQjhDM0VDMTFFOTgwMzVFN0UzNzU3NDFGNTAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTgxMzVDQjdDM0VDMTFFOTgwMzVFN0UzNzU3NDFGNTAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmRpZDpGRTc5Qjk3RkVCQzNFOTExQTVFMENFRTA1Q0RENDY3RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGRTc5Qjk3RkVCQzNFOTExQTVFMENFRTA1Q0RENDY3RSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhpGgacAAAZ3SURBVHja7F1vbBRFFF9GREBMUSpGKAIFE0msNIj4QYhEREJQotH4AfxD1EQ0GhVUIJCg4YtaUESDGiMp0koIMSJfDAIV/1shsVoxwRiJqDUpRWkTsRY4fLM7p+d1d+a92Zm93buZ5HfA3bud2Te/m3nzfjML81JX2PmAPwBnJNjquZKO3kphm1YChks+PylsXHEE6tecsfDykMJoo+flfnRd50oYgbYopq7jgGrnp/SUgSkiTz28LFQYPQujT1eF/agGwMvlgIsBPYA28EGv5Tqr4GUyYDDgh4yM+GyPYvT5FTCkwshzF+BwkR/+BLwMGGGhvksBbwNOF9W5H3Btmh01R0EejnsriDiDAE0Kf/wCqDNY53xBzqj6coBlxd8akAJn8UD+K8AVEqODYkg9F3Cd4oLfwZD7ffZjQe8OhCGfzq+Jf79sHry8AzgbYfwo1Pdi2oZp1ehzo7BtUNj1ASZknDxLEP4oHonGxagPfpDsBKE+Pr3NSouzIKZhRxQN3idsLwH8pbDdkHHyTCB2Zh4Q6LIajfquBvRo1AdBNRuaBoc9gWjsVcL2TYVdd/aX+Mo0hgztgAsJddUhMv4yPF5qZ10g8jqyRm4TtpNFECezzXh2mo0CnIrRoRwHxBIcs9o6GrOuDsBZpXTYOnw8w3aV/xKfPRKzQ/P4VD698HjJj5tM1HVDqZzFb+JvXDzDZlfGEp+9Z6hTOfYGqYB+dYwW8ZKpetaXyllNuHiGL/FZm8L22xIPpaZ8cgyxSKBgdUgdOwxd+6T48wtDUgbfguHdrTD63PNyrWA7Bf6+QGH7XCBZsDtF/kdWloPt6YyT5zx4GQaYC5gOeFrxhUOAWkneBvzsNYS8vwQwFTA64nudAIjDvFGSuvnnt4prrDHlgLWIeKZW2CIlCzYY8BNuiZ/50WcM4JaCf6vyXY2Am0Mkh3zG+DJJXQsirtklVmZtihxQgV7JHjNx82MBvbi5kiJZ8GUidolfboULqOwVOYF8u4dpS3qfIF0R35khbGQEur8UuYvjBfHM17h4BrUrcZtX1sX3Q7OCQDMl/vny/0t6NhHQKbEfriDQUhs3WY/Iz6zQkCzWlr9kgSbRu5oE4vg4WNL7s4Rq6S4j0FO2bnA3QqcZQpQsMFPiBq9iiq/MF/u5AUkg4VfU0j1PoA+L3l9n68Yw+Zl7NCSLLeUvWZB9zUeRT/rneFAEwiJPoJoCwr0qNrQZvyFMPNMu7CiSRX35SxbaPq8KRt7CLLMNAv07C7xgMb+GimfmaUgWu92uRFI/WCKQ3UZj4pkWYTteEMRJFnb64pzA17HJk2RMiYpnpgrbZidZJBIffRaDPK9binNCG4uJZ8SpUXYlovEinuGSBXaJ70pEfLRfgzzNCf8oUfFMXrLY6ySLRDPXb2gQ6MEkGzkOsQUjL1nMdZJFogRq0Jy+irQtu41sIkgW3zjJIjHyrI4ZQJ8KjvTYbeQUgmSxyEkWiZFnqaElPPfz9TYbuocgWfzsJItEyLPYYA7ojDgNMt1GQ+cQJItlTrJIhDwLI/YCxUW34XiTJFmMQCzxt4vrOslCv0/mE8lzDJHMLcRRg0emSZLF84h5dqKwdZKFXn/MJpLhd7GJ7DYi6Tr+6yv9xpqWLF4qcIKTLOj9MYN4arU7OHlKGgwKcUTvtKsdyaIn2GLpJAvNvpgmCEEJiGeGXOcBjSPTI9MgWaxykoU2eeqIp0j75Af+2HKNI9PUZxEZlSw6hODnJAs6efg+5t+ImWVEUpCtIZKoFXdk2o5kcZ+TLLTIU4PIqcWQJfwNYxQS7UM+kcOoZHEQMNBJFmTyXKRxBJl45MYXYF8j1rEr/Mi0PcniJidZkMlTLeIOSsdqHvCTHh2Kwg7JIockWaiOiXzkJAtyh1aJeIPSoTETrj6JdmrsI2JxJIsVCNtpTrIgd+aTxI58xlC9/OjQ+8S6F+tKFtVOsrBGID4avIXswI2G6x4azBqouluKAmqSZLHeSRZWSTQIMaU02tnHjJpC+efDdCWLWidZJEailujVqs1MvTSIbw/JB5Eki61OskiMRGGnLXYqltGm6h4ZkkY4FPbED/6AKf6goM2Sq8EXcwfEwbNehS38anI87T7J8/9PBx9RpTH7D4ayWXIngkQt96nHH8r1AeB2eL8vgbo7hZYGBPbGAA4DZgV960rWRiI+om8qzXOZfSmlVba14x8BBgCpg9/XrRjMFwAAAABJRU5ErkJggg=="
      />
    </div>
    <div class="events">
      <div v-for="event in longPollingStore.events" :key="event.id" class="row">
        <div class="col-xs-12 fs-70 bold">{{ event.start }} &#8212; {{ event.location }}: {{ event.subject }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useLongPollingStore } from '../stores/LongPollingStore.js'

export default {
  name: 'EventList',

  setup() {
    const longPollingStore = useLongPollingStore()

    const state = reactive({
      data: null
    })

    onMounted(async () => {
      longPollingStore.start()
    })

    return {
      ...toRefs(state),
      longPollingStore
    }
  }
}
</script>

<style scoped>
.fs-60 {
  font-size: 60px;
}

.fs-70 {
  font-size: 70px;
}

.bold {
  font-weight: bold;
}
.hashtag {
  margin-top: 15px;
}

.row {
  display: flex;
  flex-wrap: wrap;
}

.col-xs-12 {
  width: 100%;
}

body {
  font-family: Arial;
  background-color: #fee5db;
  font-weight: normal;
  color: #000000 !important;
  line-height: 1.125;
  width: 100%;
}
.tb-head {
  position: absolute;
  top: 100px;
  left: 100px;
}
.tb-logo {
  position: absolute;
  top: 125px;
  right: 100px;
}
.events {
  line-height: 1.125;
  position: absolute;
  top: 350px;
  left: 100px;
}
#wrap {
  width: 100vw;
  height: 100vh;
}

.heading3 {
  margin-top: -40px;
}
</style>
