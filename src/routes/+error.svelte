<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="font-medium leading-tight text-4xl mt-0 mb-2 text-black">
	{$page.status}: {$page.error?.message}
</div>
