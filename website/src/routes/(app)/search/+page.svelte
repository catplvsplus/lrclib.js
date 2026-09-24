<script lang="ts">
    import { InputGroup, InputGroupButton, InputGroupInput } from '$lib/components/ui/input-group';
    import { SearchIcon } from '@lucide/svelte';

</script>

<div class="grid grid-cols-3">
    <InputGroup class="rounded-xl ring-primary/20! focus-within:border-primary! hover:border-primary! hover:shadow-lg focus-within:shadow-lg shadow-primary/20 duration-300 transition-all">
        <InputGroupInput
            placeholder="Search for a song, artist, or album"
            type="text"
            class="placeholder:text-sm px-3"
        />
        <InputGroupButton
            size="icon-sm"
            class="text-primary! bg-transparent!"
        >
            <SearchIcon/>
        </InputGroupButton>
    </InputGroup>
</div>