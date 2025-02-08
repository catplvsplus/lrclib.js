<script lang="ts">
    import type { APIOptions, Track } from 'lrclib';
    import { Button } from '../ui/button';
    import SearchBox from './SearchBox.svelte';
    import { cn, getSearchName, isAdvancedSearchOptions } from '../../helpers/utils';
    import TrackSignatureSearch from './TrackSignatureSearch.svelte';
    import { slide } from 'svelte/transition';

    let {
        isAdvancedSearch = $bindable(),
        search = $bindable(),
        results = $bindable(),
        onChange,
        ...props
    }: {
        isAdvancedSearch: boolean;
        search: APIOptions.Get.Search;
        results: Track[]|null;
        onChange?: (data: APIOptions.Get.Search) => void;
        [key: string]: any;
    } = $props();

    function updateSearch(data: APIOptions.Get.Search) {
        search = data;
        isAdvancedSearch = isAdvancedSearchOptions(data);
        onChange?.(data);
    }
</script>

<div {...props} class={cn("flex flex-col", props.class)}>
    {#if isAdvancedSearch}
        {@const searchName = getSearchName(search)}
        {@const trackSignature = isAdvancedSearchOptions(search) ? search : { track_name: searchName, artist_name: '', album_name: '' }}
        <div in:slide out:slide>
            <TrackSignatureSearch
                track_name={trackSignature.track_name}
                artist_name={trackSignature.artist_name}
                album_name={trackSignature.album_name}
                onChange={updateSearch}
            />
        </div>
    {:else}
        <div in:slide out:slide>
            <SearchBox
                value={getSearchName(search)}
                onChange={val => updateSearch({ q: val })}
            />
        </div>
    {/if}
    <div class="flex justify-between p-1">
        <p class="text-muted-foreground text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            {#if results !== null}
                {@const searchName = getSearchName(search).trim()}
                {#if searchName}
                    {results.length.toLocaleString()} results for "{searchName}"
                {/if}
            {/if}
        </p>
        <Button class="h-fit w-fit p-0" variant="link" onclick={() => isAdvancedSearch = !isAdvancedSearch}>
            {#if isAdvancedSearch}
                Use simple search
            {:else}
                Use advanced search
            {/if}
        </Button>
    </div>
</div>