export const post = (req, res) => {
    const body = req.body;
    console.log(body);
    return body;
};

export const get = (req, res) => {
    const body = {
        name: 'John Doe',
        age: 25,
        email: 'johndoe@gmail.com',
        address: '123 Main Street, New York, NY 10010'
    };
    return body;
};