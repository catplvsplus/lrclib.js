<script lang="ts">
	import { cn, type WithElementRef } from "$lib/helpers/utils.js";
	import { Input } from "$lib/components/ui/input/index.js";
    import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

    type InputType = Exclude<HTMLInputTypeAttribute, "file">;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, "type"> &
			({ type: "file"; files?: FileList } | { type?: InputType; files?: undefined })
	>;

	let {
		value = $bindable(),
		class: className,
		...props
	}: Props = $props();
</script>

<Input
	data-slot="input-group-control"
	class={cn(
		"flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
		className
	)}
	bind:value
	{...props}
/>
