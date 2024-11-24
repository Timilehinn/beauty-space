import Cookies from "universal-cookie";

const makeApiCallFunction = async (methodType, endpoint, body = {}, contentType = 'application/json') => {
    const cookies = new Cookies();
    let error;
    let errorMessage;
    if (!methodType) {
        return {
            error: true,
            errorMessage: 'No method type provided'
        }
    }
    if (!endpoint) {
        return {
            error: true,
            errorMessage: 'No endpoint provided'
        }
    }

    try {
        const gottenToken = cookies.get('user_token');
        const res = await fetch(endpoint, {
            method: methodType,
            body: JSON.stringify(body),
            headers:{
                'Content-Type': contentType,
                'Authorization': `Bearer ${gottenToken}`
            }
        });
        const data = await res.json();
        if (data?.status !== true) {
            return {
                error: true,
                errorMessage: 'check error message from data returned',
                data: data
            }
        }
        return {
            error: false,
            errorMessage: 'No errors found',
            data: data
        }
    } catch (error) {
        return {
            error: true,
            errorMessage: 'Unidentified error. Check error log',
            errorLog: error
        }
    }

}

export default makeApiCallFunction;