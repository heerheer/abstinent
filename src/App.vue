<script setup lang="ts">

import { Ref, StyleValue, onMounted, reactive, ref, version } from 'vue'
import anime from 'animejs'
import QRCode from 'qrcode'

import { encodeWithKeyDataCenter, decodeWithKeyDataCenter } from './services/shortLinkService'
async function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key'); // 123  
    return { key };
}

let config = reactive({
    picUrl: 'https://cdn.pixabay.com/photo/2023/06/18/04/57/silver-throated-tanager-8071234_1280.jpg',
    day: 0,
    tip: '我们终将抵达终点',
    secretImgUrl: '',
})

onMounted(async () => {
    const { key } = await getUrlParams()
    if (key != null) {
        let data = await decodeWithKeyDataCenter(key)
        if (data) {
            config = data;
        } else {
            console.log('没有这个key对应的卡片')

        }
    }
})



const isCardFlipped = ref(false)
const menuShow = ref(false)
const qrcode = ref<HTMLImageElement>() as Ref<HTMLImageElement>


const exportImage = async () => {
    const key = await encodeWithKeyDataCenter(config)
    const url = `https://${location.host}?key=${key}`;
    createQRCode(url)
    console.log(url)
}
const createQRCode = async (url: string) => {

    const qrcode_url = await QRCode.toDataURL(url, { errorCorrectionLevel: 'M' })

    // short api  key 64hvpbZQtnWTnaApAwdUia4xrG94mePt

    qrcode.value.src = qrcode_url;
}

const flip = () => {
    anime(
        {
            targets: '.flip-card',
            'rotateY': '+=180'
        }
    )
}
</script>

<template>
    <div class=" h-screen w-screen flex  bg-line items-center justify-center">
        <div class="card w-96 bg-base-100 h-fit shadow-xl flip-card" @click="flip()">

            <div id="front" class="flip-card-side z-10">

                <figure class=" rounded-t-2xl">
                    <img :src="config.picUrl" alt="img" />
                </figure>
                <div class="card-body bg-white rounded-b-2xl">
                    <div class="flex justify-between">
                        <h2 class="card-title">禁欲打卡成功!</h2>
                        <h2 class="card-title">累计第{{ config.day }}天</h2>
                    </div>
                    <p>{{ config.tip }}</p>
                    <div class="card-actions justify-end ">
                        <div class="flex-col flex items-center">
                            <div class="w-16 h-16 bg-gray-300">
                                <img ref="qrcode" class="w-16 h-16 bg-gray-300 object-cover" />

                            </div>

                            <span class="text-xs">扫码查看分享</span>
                        </div>

                    </div>
                </div>

            </div>
            <div
                class="back bg-white w-full h-full rounded-2xl  flip-card-back flip-card-side absolute z-0 flex items-center justify-center">
                <img :src="config.secretImgUrl" class=" object-cover" alt="我的图图呢?" />
            </div>
        </div>
    </div>


    <div class="hidden h-screen w-screen flex  bg-line ">
        <div class="flip-card m-auto w-40 h-40  bg-gray-50 " :class="{ 'flipped': isCardFlipped }" @click="flip">
            <div class=" absolute back-hidden w-full h-full bg-blue-200">2</div>
            <div class=" absolute back-hidden w-full h-full bg-white flip-card-back">1</div>
        </div>
    </div>


    <div class="fixed top-0 left-0 h-screen p-4">
        <Transition name="resize">
            <div v-if="menuShow" class="bg-gray-200 h-full w-64 rounded-xl transition duration-300 p-4 pt-16 ">
                <!-- Content here -->
                <div class="h-full w-46 flex flex-col gap-2">
                    <span class="text-sm">📍图片URL</span>
                    <input type="text" placeholder="输入背景图片地址" class="input input-sm input-bordered w-full max-w-xs"
                        v-model="config.picUrl" />
                    <span class="text-sm">📅累计天数</span>
                    <input type="text" placeholder="累计天数设置" class="input input-sm input-bordered w-full max-w-xs"
                        v-model="config.day" />
                    <span class="text-sm">😁小提示</span>
                    <input type="text" placeholder="说点什么吧" class="input input-sm input-bordered w-full max-w-xs"
                        v-model="config.tip" />


                    <span class="text-sm">😘小秘密</span>
                    <input type="text" placeholder="在卡片背面藏点东西!" class="input input-sm input-bordered w-full max-w-xs"
                        v-model="config.secretImgUrl" />

                    <div class="flex-1"></div>

                    <div class="flex justify-end">
                        <button class="btn btn-primary" @click="exportImage">导出图片</button>
                    </div>
                </div>

            </div>
        </Transition>

    </div>

    <div class="fixed top-0 p-4">
        <button @click="menuShow = !menuShow" class="bg-gray-200 rounded-xl p-3 w-12 h-12 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M16 18V20H5V18H16ZM21 11V13H3V11H21ZM19 4V6H8V4H19Z"></path>
            </svg>
        </button>
    </div>
</template>

<style scoped>
.bg-line {

    background-image: repeating-linear-gradient(45deg, hsl(var(--b1)), hsl(var(--b1)) 13px, hsl(var(--b2)) 13px, hsl(var(--b2)) 14px);
}

.resize-enter-active,
.resize-leave-active {
    transition: transform 0.3s;
    transform-origin: 5% 5%;
}

.resize-enter-from,
.resize-leave-to {
    transform: scaleX(0) scaleY(0);
}

.flipped {
    perspective: 1000px;
    transform: rotateY(180deg);
    transition: all;
}

.flip-card {
    transform-style: preserve-3d;
}

.flip-card-back {
    transform: rotateY(180deg);
}

.flip-card-side {
    backface-visibility: hidden;
}
</style>
