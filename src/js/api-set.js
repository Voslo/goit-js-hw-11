import axios from "axios";

axios.defaults.baseURL = "https://pixabay.com/api/";

export async function getData(searchQuery, currentPage) {
    try {
        const response = await axios.get('', {
            params: {
                key: '41177547-eb0b90c89ca86e400805b813e',
                q: searchQuery,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: currentPage,
                per_page: '40',
            },
        });
        return response.data
    } catch (error) {
        console.log(error.message);
    } 
}

