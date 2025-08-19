<script lang="ts">
    import { Canvas, T } from '@threlte/core';
    import { Environment, ImageMaterial } from '@threlte/extras';

    let {
        coverURL
    }: {
        coverURL: string;
    } = $props();
</script>

<div class="w-full h-full absolute top-0 left-0">
    <!-- <Canvas>
        <T.PerspectiveCamera
            position={[10, 10, 10]}
            oncreate={(ref) => {
                ref.lookAt(0, 0, 0)
            }}
        />
    </Canvas> -->
    <div class="w-full h-full relative z-10">
        <div class="absolute z-20 w-full h-full backdrop-blur-2xl saturate-150 bg-black/25"></div>
        <img src={coverURL} alt="" class="size-96 object-cover absolute bottom-0 right-0 animate-spin z-10" style="animation-duration: 10s;"/>
        <img src={coverURL} alt="" class="size-96 object-cover absolute top-0 left-0 animate-spin z-10" style="animation-duration: 10s;"/>
        <img src={coverURL} alt="" class="size-96 object-cover absolute bottom-0 left-1/2 animate-spin z-10" style="animation-duration: 15s; animation-direction: reverse;"/>
        <img src={coverURL} alt="" class="w-full h-full object-cover absolute top-0 left-0"/>
    </div>
</div>