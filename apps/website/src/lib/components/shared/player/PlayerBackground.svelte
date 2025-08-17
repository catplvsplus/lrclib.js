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
        <T.Mesh>
            <T.PlaneGeometry />
            <ImageMaterial url={coverURL}/>
        </T.Mesh>
        <Environment isBackground={true} url={coverURL}/>
    </Canvas>
</div>