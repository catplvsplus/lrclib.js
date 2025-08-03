<script lang="ts">
    import Topbar from '$lib/components/shared/home/Topbar.svelte';
    import { SearchIcon } from '@lucide/svelte';
    import { Button } from '../../lib/components/ui/button';
    import { Input } from '../../lib/components/ui/input';
    import { links } from '../../lib/helpers/constants';
</script>

<Topbar/>
<div class="h-full pt-16 flex justify-center">
    <main class="container p-4 flex items-center">
        <div class="grid md:grid-cols-2 gap-4 w-full">
            <div class="w-full flex flex-col gap-5">
                <div class="flex flex-col sm:text-start text-center">
                    <h1 class="sm:text-8xl text-5xl font-bold tracking-wide">lrclib<span class="text-primary">.js</span></h1>
                    <h2 class="sm:text-xl text-lg px-5 sm:px-0 font-light tracking-wide md:max-w-96">A Library for interacting with <a href={links.lrclib} class="text-primary">lrclib.net</a> API</h2>
                </div>
                <div class="flex gap-2 md:max-w-md">
                    <Input placeholder="Search song" class="h-10 p-4"/>
                    <Button size="icon" class="size-10">
                        <SearchIcon/>
                    </Button>
                </div>
            </div>
            <div></div>
        </div>
    </main>
</div>