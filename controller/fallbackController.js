const fallbackMETHODController = (req, res) => {
    console.log('hi')
    return res.json({ 'success': false, 'message': 'Not found, what you are looking for!!!' });
    if (req.accepts('application/json')) {
        return res.status(404).json({ 'success': false, 'message': 'Not found, what you are looking for!!!' });
    } else {
        return res.status(404).send(`<h1>Not found, what you are looking for!!!'</h1>`);
    }
}

export default fallbackMETHODController;