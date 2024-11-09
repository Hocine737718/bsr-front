<script setup lang="ts">
import { FilterMatchMode } from 'primevue/api';
import { ref, onBeforeMount } from 'vue';
import { createProduct, deleteProduct, getAllProducts, updateProduct } from '@/services/product.service';
import type { CreateProductInterface, ProductInterface, UpdateProductInterface } from '@/services/interface/product.interface';
import { getFullPath } from '@/shared/utils';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
const toast = useToast();
const router = useRouter();
const products = ref<ProductInterface[] | null>([]);
const dt = ref<any>(null);
const selectedProducts = ref<any>(null);
const filters = ref<any>({});
const formatCurrency = (value: string) => {
    const numberValue = parseFloat(value);  // Convert string to number
    if (isNaN(numberValue)) {
        return 'دج 0.00';  // Return default value if not a valid number
    }
    return numberValue.toLocaleString('ar-DZ', { style: 'currency', currency: 'DZD' });
};
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
const createSubmitted = ref(false);
const createDialog = ref(false);
const product = ref<CreateProductInterface>({
    name: "",
    price: 0,
    description: undefined,
    image: undefined
});
const openCreateDialog = () => {
    createSubmitted.value = false;
    createDialog.value = true;
};
const hideCreateDialog = () => {
    createSubmitted.value = false;
    createDialog.value = false;
};
const create = async () => {
    try {
        createSubmitted.value = true;
        await createProduct(product.value);
        toast.add({ severity: 'success', summary: 'Reussite', detail: 'Votre produit est bien crée !!', life: 3000 });
    } catch (error: any) {
        console.error(error.message);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Produit n\' est pas créé !!', life: 3000 });
    }
    finally {
        router.go(0);
    }
}
const updateSubmitted = ref(false);
const updateDialog = ref(false);
const updateProductId = ref("");
const productUpdate = ref<UpdateProductInterface>({
    name: "",
    price: 0,
    description: undefined,
    image: undefined
});
const openUpdateDialog = (data: any) => {
    updateSubmitted.value = false;
    updateDialog.value = true;
    updateProductId.value = data.id;
    productUpdate.value.image = data.image;
    productUpdate.value.price = data.price;
    productUpdate.value.description = data.description;
    productUpdate.value.name = data.name;
};
const hideUpdateDialog = () => {
    updateSubmitted.value = false;
    updateDialog.value = false;
};
const update = async () => {
    try {
        updateSubmitted.value = true;
        await updateProduct(updateProductId.value, productUpdate.value);
        toast.add({ severity: 'success', summary: 'Reussite', detail: 'Votre produit est bien modifié !!', life: 3000 });
    } catch (error: any) {
        console.error(error.message);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Produit n\' est pas modifié !!', life: 3000 });
    }
    finally {
        router.go(0);
    }
}
const deleteSubmitted = ref(false);
const deleteDialog = ref(false);
const deleteProductId = ref("");
const openDeleteDialog = (data: any) => {
    deleteSubmitted.value = false;
    deleteDialog.value = true;
    deleteProductId.value = data.id;
};
const hideDeleteDialog = () => {
    deleteSubmitted.value = false;
    deleteDialog.value = false;
};
const remove = async () => {
    try {
        deleteSubmitted.value = true;
        await deleteProduct(deleteProductId.value);
        toast.add({ severity: 'success', summary: 'Reussite', detail: 'Votre produit est bien supprimé !!', life: 3000 });
    } catch (error: any) {
        console.error(error.message);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Produit n\' est pas supprimé !!', life: 3000 });
    }
    finally {
        router.go(0);
    }
}
onBeforeMount(async () => {
    let res = await getAllProducts();
    res.forEach((item) => {
        products.value?.push(item);
    });
    initFilters();
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card" v-if="products && products.length">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Ajouter" icon="pi pi-plus" class="mr-2" severity="success"
                                @click="openCreateDialog" />
                        </div>
                    </template>
                </Toolbar>
                <DataTable ref="dt" :value="products" v-model:selection="selectedProducts" dataKey="id"
                    :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Affichage {first} -> {last} / {totalRecords} produits">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Gestion des produits</h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText class="w-full sm:w-auto" v-model="filters['global'].value"
                                    placeholder="Rechercher..." />
                            </IconField>
                        </div>
                    </template>
                    <!-- <Column selectionMode="multiple" headerStyle="width: 3rem"></Column> -->
                    <Column field="name" header="Nom" :sortable="true" headerStyle="width:25%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nom</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column header="Image" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Image</span>
                            <img :src="getFullPath(slotProps.data.image)" alt="Product Image" class="shadow-2"
                                width="100" />
                        </template>
                    </Column>
                    <Column field="price" header="Prix" :sortable="true" headerStyle="width:25%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Prix</span>
                            {{ formatCurrency(slotProps.data.price) }}
                        </template>
                    </Column>
                    <Column field="description" header="Description" :sortable="false"
                        headerStyle="width:25%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Description</span>
                            <Textarea id="description" v-model="slotProps.data.description" required="true" rows="3"
                                cols="20" />
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded
                                @click="openUpdateDialog(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="danger" rounded
                                @click="openDeleteDialog(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog v-model:visible="createDialog" :style="{ width: '450px' }" header="Product Details"
                    :modal="true" class="p-fluid">
                    <img :src="getFullPath(product.image)" :alt="product.image" v-if="product.image" width="150"
                        class="mt-0 mx-auto mb-5 block shadow-2" />
                    <div class="field">
                        <label for="name">Nom</label>
                        <InputText id="name" v-model.trim="product.name" required="true" autofocus
                            :invalid="createSubmitted && !product.name" />
                        <small class="p-invalid" v-if="createSubmitted && !product.name">Nom est obligatoire.</small>
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" />
                    </div>

                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="price">Prix</label>
                            <InputNumber id="price" v-model="product.price" mode="currency" currency="DZD"
                                locale="ar-DZ" :invalid="createSubmitted && !product.price" :required="true" />
                            <small class="p-invalid" v-if="createSubmitted && !product.price">Prix est
                                obligatoire.</small>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Fermer" icon="pi pi-times" @click="hideCreateDialog" />
                        <Button label="Sauvegarder" icon="pi pi-check" @click="create" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="updateDialog" :style="{ width: '450px' }" header="Product Details"
                    :modal="true" class="p-fluid">
                    <img :src="getFullPath(productUpdate.image)" :alt="productUpdate.image" v-if="productUpdate.image"
                        width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
                    <div class="field">
                        <label for="name">Nom</label>
                        <InputText id="name" v-model.trim="productUpdate.name" required="true" autofocus
                            :invalid="updateSubmitted && !productUpdate.name" />
                        <small class="p-invalid" v-if="updateSubmitted && !productUpdate.name">Nom est
                            obligatoire.</small>
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="productUpdate.description" required="true" rows="3"
                            cols="20" />
                    </div>

                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="price">Prix</label>
                            <InputNumber id="price" v-model="productUpdate.price" mode="currency" currency="DZD"
                                locale="ar-DZ" :invalid="updateSubmitted && !productUpdate.price" :required="true" />
                            <small class="p-invalid" v-if="updateSubmitted && !product.price">Prix est
                                obligatoire.</small>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Fermer" icon="pi pi-times" @click="hideUpdateDialog" />
                        <Button label="Sauvegarder" icon="pi pi-check" @click="update" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Voulez-vous vraiment supprimer <b>{{ product.name }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="Non" icon="pi pi-times" text @click="deleteDialog = false" />
                        <Button label="Oui" icon="pi pi-check" text @click="remove" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
