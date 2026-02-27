const { getAdminProductsAction } = require('./src/app/actions/products');

async function test() {
    try {
        const result = await getAdminProductsAction({ search: '' });
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
