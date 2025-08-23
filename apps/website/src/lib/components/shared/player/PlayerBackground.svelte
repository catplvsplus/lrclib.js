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
    <Canvas>
        <T.PerspectiveCamera
            position={[10, 10, 10]}
            oncreate={(ref) => {
                ref.lookAt(0, 0, 0)
            }}
        />
    </Canvas>
</div>