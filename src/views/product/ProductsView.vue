<script setup lang="ts">
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted } from 'vue';
import { createProduct, deleteProduct, getAllProducts, updateProduct, uploadProductImage } from '@/services/product.service';
import type { CreateProductInterface, ProductInterface, UpdateProductInterface } from '@/services/interface/product.interface';
import { getFullPath } from '@/shared/utils';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();
const products = ref<ProductInterface[]>([]);
const dt = ref();
const selectedProducts = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const formatCurrency = (value: string) => {
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) {
        return 'DZD 0.00';
    }
    return numberValue.toLocaleString('en-US', { style: 'currency', currency: 'DZD' });
};

const createSubmitted = ref(false);
const createDialog = ref(false);
const product = ref<CreateProductInterface>({
    name: "",
    price: 0,
    description: undefined,
    image: undefined
});

const previewImage = ref<string | null>(null);
const previewImageFile = ref<File | null>(null);


const onUpload = (event: any) => {
    const file = event.files[0];
    if (file) {
        previewImageFile.value = file;
        const reader = new FileReader();
        reader.onloadend = () => {
            previewImage.value = reader.result as string;
        };
        reader.readAsDataURL(file);
    }
};

const onClearImage = () => {
    previewImage.value = '';
    product.value.image = undefined;
};

const openCreateDialog = () => {
    product.value = {
        name: "",
        price: 0,
        description: undefined,
        image: undefined
    };
    previewImage.value = null;
    createSubmitted.value = false;
    createDialog.value = true;
};

const hideCreateDialog = () => {
    createSubmitted.value = false;
    createDialog.value = false;
    onClearImage();
};

const create = async () => {
    try {
        createSubmitted.value = true;
        if (!product.value.name || !product.value.price) return;

        let res = await createProduct(product.value);
        if (previewImageFile.value) await uploadProductImage(res.id, previewImageFile.value);
        previewImageFile.value = null;
        createDialog.value = false;
        await loadProducts();
        toast.add({ severity: 'success', summary: 'Reussite', detail: 'Votre produit est bien crée !!', life: 3000 });
    } catch (error: any) {
        console.error(error.message);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Produit n\' est pas créé !!', life: 3000 });
    }
};

const updateSubmitted = ref(false);
const updateDialog = ref(false);
const updateProductId = ref("");
const productUpdate = ref<UpdateProductInterface>({
    name: "",
    price: 0,
    description: undefined,
    image: undefined
});

const previewUpdateImage = ref<string | null>(null);

const onUpdateUpload = (event: any) => {
    const file = event.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            previewUpdateImage.value = reader.result as string;
        };
        reader.readAsDataURL(file);
        previewImageFile.value = file;
    }
};

const onClearUpdateImage = () => {
    previewUpdateImage.value = null;
    productUpdate.value.image = undefined;
};

const openUpdateDialog = (data: ProductInterface) => {
    updateProductId.value = data.id;
    productUpdate.value = {
        name: data.name,
        price: data.price,
        description: data.description,
        image: data.image
    };
    previewUpdateImage.value = data.image ? getFullPath(data.image) : null;
    updateSubmitted.value = false;
    updateDialog.value = true;
};

const hideUpdateDialog = () => {
    updateSubmitted.value = false;
    updateDialog.value = false;
    onClearUpdateImage();
};

const update = async () => {
    try {
        updateSubmitted.value = true;
        if (!productUpdate.value.name || !productUpdate.value.price) return;

        let res: any = await updateProduct(updateProductId.value, productUpdate.value);
        if (previewImageFile.value) await uploadProductImage(res.id, previewImageFile.value);
        updateDialog.value = false;
        await loadProducts();
        toast.add({ severity: 'success', summary: 'Reussite', detail: 'Votre produit est bien modifié !!', life: 3000 });
    } catch (error: any) {
        console.error(error.message);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Produit n\' est pas modifié !!', life: 3000 });
    }
};

const deleteDialog = ref(false);
const deleteProductId = ref("");

const openDeleteDialog = (data: ProductInterface) => {
    deleteProductId.value = data.id;
    deleteDialog.value = true;
};

const remove = async () => {
    try {
        await deleteProduct(deleteProductId.value);
        deleteDialog.value = false;
        await loadProducts();
        toast.add({ severity: 'success', summary: 'Reussite', detail: 'Votre produit est bien supprimé !!', life: 3000 });
    } catch (error: any) {
        console.error(error.message);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Produit n\' est pas supprimé !!', life: 3000 });
    }
};

const loadProducts = async () => {
    const res = await getAllProducts();
    products.value = res;
};

onMounted(async () => {
    await loadProducts();
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
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
                                <InputText v-model="filters.global.value" placeholder="Rechercher..." />
                            </IconField>
                        </div>
                    </template>
                    <Column field="name" header="Nom" :sortable="true" headerStyle="width:25%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nom</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column header="Image" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Image</span>
                            <img :src="getFullPath(slotProps.data.image)" :alt="slotProps.data.name" class="shadow-2"
                                width="100" />
                        </template>
                    </Column>
                    <Column field="price" header="Prix" :sortable="true" headerStyle="width:25%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Prix</span>
                            {{ formatCurrency(slotProps.data.price) }}
                        </template>
                    </Column>
                    <Column field="description" header="Description" headerStyle="width:25%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Description</span>
                            {{ slotProps.data.description }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded
                                @click="openUpdateDialog(slotProps.data)" />
                            <Button icon="pi pi-trash" severity="danger" rounded
                                @click="openDeleteDialog(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="createDialog" :style="{ width: '450px' }" header="Product Details"
                    :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="image">Image</label>
                        <div class="flex flex-column">
                            <FileUpload name="demo[]" @uploader="onUpload" accept="image/*"
                                chooseLabel="Choisir une image" :maxFileSize="10000000" customUpload />
                            <div v-if="previewImage" class="flex flex-column align-items-center mt-2">
                                <img :src="previewImage" alt="Preview" class="w-20rem h-12rem object-contain mb-2" />
                                <Button icon="pi pi-times" severity="danger" @click="onClearImage" text />
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label for="name">Nom</label>
                        <InputText id="name" v-model.trim="product.name" required="true" autofocus
                            :class="{ 'p-invalid': createSubmitted && !product.name }" />
                        <small class="p-error" v-if="createSubmitted && !product.name">Nom est obligatoire.</small>
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="product.description" rows="3" cols="20" />
                    </div>
                    <div class="field">
                        <label for="price">Prix</label>
                        <InputNumber id="price" v-model="product.price" mode="currency" currency="DZD" locale="en-US"
                            :class="{ 'p-invalid': createSubmitted && !product.price }" />
                        <small class="p-error" v-if="createSubmitted && !product.price">Prix est obligatoire.</small>
                    </div>
                    <template #footer>
                        <Button label="Fermer" icon="pi pi-times" @click="hideCreateDialog" text />
                        <Button label="Sauvegarder" icon="pi pi-check" @click="create" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="updateDialog" :style="{ width: '450px' }" header="Product Details"
                    :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="image">Image</label>
                        <div class="flex flex-column">
                            <FileUpload name="demo[]" @uploader="onUpdateUpload" accept="image/*"
                                chooseLabel="Choisir une image" :maxFileSize="10000000" customUpload />
                            <div v-if="previewUpdateImage" class="flex flex-column align-items-center mt-2">
                                <img :src="previewUpdateImage" alt="Preview"
                                    class="w-20rem h-12rem object-contain mb-2" />
                                <Button icon="pi pi-times" severity="danger" @click="onClearUpdateImage" text />
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label for="name">Nom</label>
                        <InputText id="name" v-model.trim="productUpdate.name" required="true" autofocus
                            :class="{ 'p-invalid': updateSubmitted && !productUpdate.name }" />
                        <small class="p-error" v-if="updateSubmitted && !productUpdate.name">Nom est
                            obligatoire.</small>
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="productUpdate.description" rows="3" cols="20" />
                    </div>
                    <div class="field">
                        <label for="price">Prix</label>
                        <InputNumber id="price" v-model="productUpdate.price" mode="currency" currency="DZD"
                            locale="en-US" :class="{ 'p-invalid': updateSubmitted && !productUpdate.price }" />
                        <small class="p-error" v-if="updateSubmitted && !productUpdate.price">Prix est
                            obligatoire.</small>
                    </div>
                    <template #footer>
                        <Button label="Fermer" icon="pi pi-times" @click="hideUpdateDialog" text />
                        <Button label="Sauvegarder" icon="pi pi-check" @click="update" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>Voulez-vous vraiment supprimer ce produit?</span>
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