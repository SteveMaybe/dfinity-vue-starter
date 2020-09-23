<template>
    <div class="bg-blue-400 text-white">
        Message is {{ message }}
    </div>
</template>

<script>
import canister from "ic:canisters/backend";

export default {
    data() {
        return {
            message: ''
        }
    },
    methods: {

    },
    async mounted() {
        let self = this;
        canister.greet().then(v => {
            self.message = v;
        });
    }
}
</script>