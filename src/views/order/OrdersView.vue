<script setup lang="ts">
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, watch } from 'vue';
import { confirmOrder, createOrder, createOrderItems, deleteOrder, getAllOrders, updateOrder } from '@/services/order.service';
import type { CreateOrderInterface, OrderInterface, UpdateOrderInterface } from '@/services/interface/order.interface';
import { useToast } from 'primevue/usetoast';
import type { CreateCustomerInterface, UpdateCustomerInterface } from '@/services/interface/customer.interface';
import { createCustomer, updateCustomer } from '@/services/customer.service';
import WilayasMunicipalitiesJSON from '@/data/wilayas_municipalities.json' with { type: 'json' }
import type { ProductInterface } from '@/services/interface/product.interface';
import { getAllProducts } from '@/services/product.service';
import { Size, sizeEnumList } from '@/shared/utils';

const toast = useToast();
const checkboxValue = ref([] as string[]);
const products = ref<ProductInterface[]>([]);
const orders = ref<OrderInterface[]>([]);
const dt = ref();
const selectedOrders = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
let addressList = WilayasMunicipalitiesJSON
let municipalities = ref<any>([]);
let wilayas = Object.keys(WilayasMunicipalitiesJSON).map((item) => { return { name: item } });

function formatDate(d: string) {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
const formatCurrency = (value: string) => {
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) {
        return '0 DZD';
    }
    return numberValue + " DZD";
};
const calculTotal = (items: { price: number, quantity: number }[]) => {
    let total = 0;
    items.forEach((item) => {
        total += item.price * item.quantity;
    })
    return total;
}
const loadOrders = async () => {
    const res = await getAllOrders();
    orders.value = res;
};
onMounted(async () => {
    await loadOrders();
    products.value = await getAllProducts();
});

const createSubmitted = ref(false);
const createDialog = ref(false);
const customer = ref<CreateCustomerInterface>({
    name: "",
    phone: "",
    address: {
        province: '',
        municipality: '',
        street: '',
    }
});
const order = ref<CreateOrderInterface>({
    customerId: "",
    observation: "",
    total: 0,
    delivery_cost: 0,
    is_to_office: false,
    items: []
});
const openCreateDialog = () => {
    checkboxValue.value.length = 0;
    customer.value.name = "";
    customer.value.phone = "";
    customer.value.address.province = "";
    customer.value.address.municipality = "";
    customer.value.address.street = "";
    order.value = {
        customerId: "",
        observation: "",
        total: 0,
        delivery_cost: 0,
        is_to_office: false,
        items: []
    };
    createSubmitted.value = false;
    createDialog.value = true;
};
const hideCreateDialog = () => {
    createSubmitted.value = false;
    createDialog.value = false;
};
const addOrderItem = () => {
    let product = products.value[0];
    let item = ref({
        product_id: product.id,
        order_id: "",
        price: product.price,
        quantity: 1,
        observation: undefined,
        size: Size.S
    });
    order.value.items?.push(item.value);
    order.value.total += product.price;
    watch(() => item.value.product_id, (newValue, oldValue) => {
        if (newValue !== oldValue) {
            let prd = products.value.find((item) => item.id === newValue);
            if (prd) item.value.price = prd?.price;
        }

        if (order.value.total && order.value.items) order.value.total = calculTotal(order.value.items);
    });
    watch(item, () => {
        if (order.value.total && order.value.items) order.value.total = calculTotal(order.value.items);
    }, { deep: true });
}
const removeItem = (index: number) => {
    if (order.value.items && index !== -1) {
        let item = order.value.items.splice(index, 1);
        if (order.value.total) order.value.total -= item[0].price * item[0].quantity;
    }
}
const create = async () => {
    try {
        createSubmitted.value = true;
        order.value.is_to_office = checkboxValue.value.length > 0;
        customer.value.address.province = customer.value.address.province.name;
        customer.value.address.municipality = customer.value.address.municipality.name;
        let res = await createCustomer(customer.value);
        let items = (order.value.items) ? order.value.items : [];
        order.value.items = undefined;
        let o = await createOrder({ ...order.value, customerId: res.id });
        await createOrderItems(o.id, items.map((it) => { return { ...it, order_id: o.id } }));

        createDialog.value = false;
        await loadOrders();
        toast.add({ severity: 'success', summary: 'Reussite', detail: 'Votre commande est bien crée !!', life: 3000 });
    } catch (error: any) {
        console.error(error.message);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Commande n\' est pas créé !!', life: 3000 });
    }
};
watch(customer.value, (newValue) => {
    municipalities.value.length = 0;
    if (newValue.address && newValue.address.province) {
        let list = (addressList as any)[newValue.address.province.name]
        if (list) {
            list.forEach((item: any) => {
                municipalities.value.push({ name: item });
            });
        }
    }
});

const updateSubmitted = ref(false);
const updateDialog = ref(false);
const updateOrderId = ref("");
const orderUpdate = ref<UpdateOrderInterface>({
    customerId: "",
    observation: "",
    total: 0,
    delivery_cost: 0,
    is_to_office: false,
    items: []
});
const customerUpdate = ref<UpdateCustomerInterface>({
    name: "",
    phone: "",
    address: {
        province: '',
        municipality: '',
        street: '',
    }
});
const openUpdateDialog = (data: OrderInterface) => {
    customerUpdate.value.name = "";
    customerUpdate.value.phone = "";
    customerUpdate.value.address.province = "";
    customerUpdate.value.address.municipality = "";
    customerUpdate.value.address.street = "";
    checkboxValue.value.length = 0;
    if (data.is_to_office) checkboxValue.value.push("TRUE");
    updateOrderId.value = data.id;
    customerUpdate.value.name = data.customer?.name;
    customerUpdate.value.phone = data.customer?.phone;
    customerUpdate.value.address.province = { name: data.customer?.address.province };
    customerUpdate.value.address.municipality = { name: data.customer?.address.municipality };
    customerUpdate.value.address.street = "";
    orderUpdate.value = {
        customerId: data.customerId,
        observation: data.observation,
        total: data.total,
        delivery_cost: data.delivery_cost,
        is_to_office: data.is_to_office,
        items: [],
    };
    if (data?.items && data?.items.length) {
        data.items.forEach((item, index) => {
            orderUpdate.value.items?.push(item);
            watch(() => item.product_id, (newValue, oldValue) => {
                if (newValue !== oldValue) {
                    let prd = products.value.find((item) => item.id === newValue);
                    if (prd) item.price = prd?.price;
                }
                if (orderUpdate.value.total && orderUpdate.value.items) orderUpdate.value.total = calculTotal(orderUpdate.value.items);
            });
            watch(ref(item), () => {
                if (orderUpdate.value.total && orderUpdate.value.items) orderUpdate.value.total = calculTotal(orderUpdate.value.items);
            }, { deep: true });
        });
    }
    updateSubmitted.value = false;
    updateDialog.value = true;
};
const hideUpdateDialog = () => {
    updateSubmitted.value = false;
    updateDialog.value = false;
};
const addOrderUpdateItem = () => {
    let product = products.value[0];
    let item = ref({
        product_id: product.id,
        order_id: "",
        price: product.price,
        quantity: 1,
        observation: undefined,
        size: Size.S
    });
    orderUpdate.value.items?.push(item.value);
    if (orderUpdate.value.total) orderUpdate.value.total += product.price;
    else orderUpdate.value.total = product.price;
    watch(() => item.value.product_id, (newValue, oldValue) => {
        if (newValue !== oldValue) {
            let prd = products.value.find((item) => item.id === newValue);
            if (prd) item.value.price = prd?.price;
        }
        if (orderUpdate.value.total && orderUpdate.value.items) orderUpdate.value.total = calculTotal(orderUpdate.value.items);
    });
    watch(item, () => {
        if (orderUpdate.value.total && orderUpdate.value.items) orderUpdate.value.total = calculTotal(orderUpdate.value.items);
    }, { deep: true });
}
const removeItemUpdate = (index: number) => {
    if (orderUpdate.value.items && index !== -1) {
        let item = orderUpdate.value.items.splice(index, 1);
        if (orderUpdate.value.total) orderUpdate.value.total -= item[0].price * item[0].quantity;
    }
}
const update = async () => {
    try {
        updateSubmitted.value = true;
        orderUpdate.value.is_to_office = checkboxValue.value.length > 0;
        let items = (orderUpdate.value.items) ? orderUpdate.value.items : [];
        orderUpdate.value.items = undefined;
        let o = await updateOrder(updateOrderId.value, orderUpdate.value);
        await createOrderItems(o.id, items.map((it) => { return { ...it, order_id: o.id } }));
        let res = await updateOrder(updateOrderId.value, orderUpdate.value);
        customerUpdate.value.address.province = customerUpdate.value.address.province.name;
        customerUpdate.value.address.municipality = customerUpdate.value.address.municipality.name;
        await updateCustomer(res.customerId as string, customerUpdate.value);
        updateDialog.value = false;
        await loadOrders();
        toast.add({ severity: 'success', summary: 'Reussite', detail: 'Votre commande est bien modifié !!', life: 3000 });
    } catch (error: any) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Commande n\' est pas modifié !!', life: 3000 });
    }
};
watch(customerUpdate.value, (newValue) => {
    municipalities.value.length = 0
    if (newValue.address && newValue.address.province) {
        let list = (addressList as any)[newValue.address.province.name]
        if (list) {
            list.forEach((item: any) => {
                municipalities.value.push({ name: item })
            })
        }
    }

});

const deleteDialog = ref(false);
const deleteOrderId = ref("");
const openDeleteDialog = (data: OrderInterface) => {
    deleteOrderId.value = data.id;
    deleteDialog.value = true;
};
const remove = async () => {
    try {
        await deleteOrder(deleteOrderId.value);
        deleteDialog.value = false;
        await loadOrders();
        toast.add({ severity: 'success', summary: 'Reussite', detail: 'Votre commande est bien supprimé !!', life: 3000 });
    } catch (error: any) {
        console.error(error.message);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Commande n\' est pas supprimé !!', life: 3000 });
    }
};

const confirmDialog = ref(false);
const confirmOrderId = ref("");
const openConfirmDialog = (data: OrderInterface) => {
    confirmOrderId.value = data.id;
    confirmDialog.value = true;
};
const confirm = async () => {
    try {
        await confirmOrder(confirmOrderId.value);
        confirmDialog.value = false;
        await loadOrders();
        toast.add({ severity: 'success', summary: 'Reussite', detail: 'Votre commande a été envoyé au Anderson !!', life: 3000 });
    } catch (error: any) {
        console.error(error.message);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Commande n\' a pas été envoyé au Anderson !!', life: 3000 });
    }
};
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
                <DataTable ref="dt" :value="orders" v-model:selection="selectedOrders" dataKey="id" :paginator="true"
                    :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Affichage {first} -> {last} / {totalRecords} commandes">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Gestion des commandes</h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText v-model="filters.global.value" placeholder="Rechercher..." />
                            </IconField>
                        </div>
                    </template>
                    <Column field="name" header="Date" :sortable="true" headerStyle="width:25%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Date</span>
                            {{ formatDate(slotProps.data.createdAt) }}
                        </template>
                    </Column>
                    <Column header="Total" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Total</span>
                            {{ formatCurrency(slotProps.data.total) }}
                        </template>
                    </Column>
                    <Column header="Total aprés livraison" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Total aprés livraison</span>
                            {{ formatCurrency(slotProps.data.total + slotProps.data.delivery_cost) }}
                        </template>
                    </Column>
                    <Column field="observation" header="Observation" headerStyle="width:25%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Observation</span>
                            {{ slotProps.data.observation }}
                        </template>
                    </Column>
                    <Column field="is_to_office" header="Vers Bureau" headerStyle="width:25%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Vers Bureau</span>
                            {{ (slotProps.data.is_to_office) ? "Oui" : "Non" }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:12rem;">
                        <template #body="slotProps">
                            <Button v-if="slotProps.data.andersonOrders.status !== 'Success'" icon="pi pi-check"
                                class="mr-2" severity="info" rounded @click="openConfirmDialog(slotProps.data)" />
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded
                                @click="openUpdateDialog(slotProps.data)" />
                            <Button icon="pi pi-trash" severity="danger" rounded
                                @click="openDeleteDialog(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="createDialog" :style="{ width: '450px' }" header="Order Details" :modal="true"
                    class="p-fluid">
                    <div class="field">
                        <label for="name">Nom</label>
                        <InputText id="name" v-model.trim="customer.name" required="true" autofocus
                            :class="{ 'p-invalid': createSubmitted && !customer.name }" />
                        <small class="p-error" v-if="createSubmitted && !customer.name">Nom est obligatoire.</small>
                    </div>
                    <div class="field">
                        <label for="phone">Téléphone</label>
                        <InputText id="phone" v-model.trim="customer.phone" required="true" autofocus
                            :class="{ 'p-invalid': createSubmitted && !customer.phone }" />
                        <small class="p-error" v-if="createSubmitted && !customer.phone">Téléphone est
                            obligatoire.</small>
                    </div>
                    <div class="field">
                        <label for="Wilaya">Wilaya</label>
                        <Dropdown v-model="customer.address.province" :options="wilayas" optionLabel="name"
                            placeholder="Aucun" :filter="true" />
                    </div>
                    <div class="field">
                        <label for="Commun">Commun</label>
                        <Dropdown v-model="customer.address.municipality" :options="municipalities" optionLabel="name"
                            placeholder="Aucun" :filter="true" />
                    </div>
                    <div class="field">
                        <label for="observation">Observation</label>
                        <Textarea id="observation" v-model="order.observation" rows="3" cols="20" />
                    </div>
                    <div class="field text-center">
                        <Button icon="pi pi-plus" class="mr-2" severity="success" rounded @click="addOrderItem()" />
                    </div>
                    <span v-if="order.items && order.items.length" v-for="(item, index) in order.items">
                        <div class="field">
                            <div class="formgrid grid">
                                <div class="field col">
                                    <label for="Commun">Produit</label>
                                    <Dropdown v-model="item.product_id" :options="products" optionLabel="name"
                                        optionValue="id" placeholder="Aucun" :filter="true" />
                                </div>
                                <div class="field col">
                                    <label for="Commun">Taille</label>
                                    <Dropdown v-model="item.size"
                                        :options="sizeEnumList.map((item) => { return { value: item } })"
                                        optionLabel="value" optionValue="value" placeholder="Aucun" :filter="true" />
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <div class="formgrid grid">
                                <div class="field col">
                                    <label for="quantity">Quantité</label>
                                    <InputNumber id="quantity" v-model="item.quantity" required="true" autofocus
                                        :class="{ 'p-invalid': createSubmitted && !item.quantity }" />
                                    <small class="p-error" v-if="createSubmitted && !item.quantity">Quantité est
                                        obligatoire.</small>
                                </div>
                                <div class="field col">
                                    <label for="price">Prix</label>
                                    <InputNumber id="price" v-model="item.price"
                                        :class="{ 'p-invalid': createSubmitted && !item.price }" />
                                    <small class="p-error" v-if="createSubmitted && !item.price">Prix est
                                        obligatoire.</small>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <Button severity="danger" label="Supprimer" icon="pi pi-trash" @click="removeItem(index)" />
                        </div>
                        <Divider layout="horizontal"></Divider>
                    </span>
                    <div class="field">
                        <label for="total">Total</label>
                        <InputNumber id="total" v-model="order.total" required="true" autofocus
                            :class="{ 'p-invalid': createSubmitted && !order.total }" />
                        <small class="p-error" v-if="createSubmitted && !order.total">Total est obligatoire.</small>
                    </div>
                    <div class="field">
                        <label for="delivery_cost">Livraison</label>
                        <InputNumber id="delivery_cost" v-model="order.delivery_cost" autofocus
                            :class="{ 'p-invalid': createSubmitted && !order.delivery_cost }" />
                    </div>
                    <div class="field">
                        <div class="field-checkbox mb-0">
                            <Checkbox id="checkOption1" name="option" value="TRUE" v-model="checkboxValue" />
                            <label for="checkOption1">Vers Bureau</label>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Fermer" icon="pi pi-times" @click="hideCreateDialog" text />
                        <Button label="Sauvegarder" icon="pi pi-check" @click="create" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="updateDialog" :style="{ width: '450px' }" header="Order Details" :modal="true"
                    class="p-fluid">
                    <div class="field">
                        <label for="name">Nom</label>
                        <InputText id="name" v-model.trim="customerUpdate.name" required="true" autofocus
                            :class="{ 'p-invalid': createSubmitted && !customerUpdate.name }" />
                        <small class="p-error" v-if="createSubmitted && !customerUpdate.name">Nom est
                            obligatoire.</small>
                    </div>
                    <div class="field">
                        <label for="phone">Téléphone</label>
                        <InputText id="phone" v-model.trim="customerUpdate.phone" required="true" autofocus
                            :class="{ 'p-invalid': createSubmitted && !customerUpdate.phone }" />
                        <small class="p-error" v-if="createSubmitted && !customerUpdate.phone">Téléphone est
                            obligatoire.</small>
                    </div>
                    <div class="field">
                        <label for="Wilaya">Wilaya</label>
                        <Dropdown v-model="customerUpdate.address.province" :options="wilayas" optionLabel="name"
                            placeholder="Aucun" :filter="true" />
                    </div>
                    <div class="field">
                        <label for="Commun">Commun</label>
                        <Dropdown v-model="customerUpdate.address.municipality" :options="municipalities"
                            optionLabel="name" placeholder="Aucun" :filter="true" />
                    </div>
                    <div class="field">
                        <label for="observation">Observation</label>
                        <Textarea id="observation" v-model="orderUpdate.observation" rows="3" cols="20" />
                    </div>
                    <div class="field text-center">
                        <Button icon="pi pi-plus" class="mr-2" severity="success" rounded
                            @click="addOrderUpdateItem()" />
                    </div>
                    <span v-if="orderUpdate.items && orderUpdate.items.length"
                        v-for="(item, index) in orderUpdate.items">
                        <div class="field">
                            <div class="formgrid grid">
                                <div class="field col">
                                    <label for="Commun">Produit</label>
                                    <Dropdown v-model="item.product_id" :options="products" optionLabel="name"
                                        optionValue="id" placeholder="Aucun" :filter="true" />
                                </div>
                                <div class="field col">
                                    <label for="Commun">Taille</label>
                                    <Dropdown v-model="item.size" :options="sizeEnumList" placeholder="Aucun"
                                        :filter="true" />
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <div class="formgrid grid">
                                <div class="field col">
                                    <label for="quantity">Quantité</label>
                                    <InputNumber id="quantity" v-model="item.quantity" required="true" autofocus
                                        :class="{ 'p-invalid': updateSubmitted && !item.quantity }" />
                                    <small class="p-error" v-if="updateSubmitted && !item.quantity">Quantité est
                                        obligatoire.</small>
                                </div>
                                <div class="field col">
                                    <label for="price">Prix</label>
                                    <InputNumber id="price" v-model="item.price"
                                        :class="{ 'p-invalid': updateSubmitted && !item.price }" />
                                    <small class="p-error" v-if="updateSubmitted && !item.price">Prix est
                                        obligatoire.</small>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <Button severity="danger" label="Supprimer" icon="pi pi-trash"
                                @click="removeItemUpdate(index)" />
                        </div>
                        <Divider layout="horizontal"></Divider>
                    </span>
                    <div class="field">
                        <label for="total">Total</label>
                        <InputNumber id="total" v-model="orderUpdate.total" required="true" autofocus
                            :class="{ 'p-invalid': updateSubmitted && !orderUpdate.total }" />
                        <small class="p-error" v-if="updateSubmitted && !orderUpdate.total">Total est
                            obligatoire.</small>
                    </div>
                    <div class="field">
                        <label for="delivery_cost">Livraison</label>
                        <InputNumber id="delivery_cost" v-model="orderUpdate.delivery_cost" required="true" autofocus
                            :class="{ 'p-invalid': updateSubmitted && !orderUpdate.delivery_cost }" />
                        <small class="p-error" v-if="updateSubmitted && !orderUpdate.delivery_cost">Livraison est
                            obligatoire.</small>
                    </div>
                    <div class="field">
                        <div class="field-checkbox mb-0">
                            <Checkbox id="checkOption2" name="option" value="TRUE" v-model="checkboxValue" />
                            <label for="checkOption2">Vers Bureau</label>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Fermer" icon="pi pi-times" @click="hideUpdateDialog" text />
                        <Button label="Sauvegarder" icon="pi pi-check" @click="update" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>Voulez-vous vraiment supprimer cette commande?</span>
                    </div>
                    <template #footer>
                        <Button label="Non" icon="pi pi-times" text @click="deleteDialog = false" />
                        <Button label="Oui" icon="pi pi-check" text @click="remove" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="confirmDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>Voulez-vous vraiment confirmer cette commande?</span>
                    </div>
                    <template #footer>
                        <Button label="Non" icon="pi pi-times" text @click="confirmDialog = false" />
                        <Button label="Oui" icon="pi pi-check" text @click="confirm" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>