export const get = (req, res) => {
    const body = {
        name: 'Ajay',
        age: 25,
        email: 'ajay@gmail.com',
        address: '123 Main Street, New York, NY 10010'
    };
    return body;
};