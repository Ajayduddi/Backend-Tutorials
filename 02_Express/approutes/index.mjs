export const defaultFunc = (req,res) => {
    if(req.method === 'GET'){
        return ('Hello World! this is the get method from default route');
    }

    if(req.method === 'POST'){
        return ('Hello World! this is the post method from default route');
    }

    return ('Hello World! this is the default route ');
}