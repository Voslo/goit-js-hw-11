import simpleLightbox from "simplelightbox";
import Notiflix from "notiflix";
import { createMarkup } from "./markup";
import { getData } from "./api-set";
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

const options = ({
    root: null,
    rootMargin: "300px",
    threshold: 0
})

const observer = new IntersectionObserver(handlePagination, options)

let maxPages;
let currentPage;
let searchQuery = '';
let firstSearch = true;

const lightbox = new simpleLightbox('.gallery a', {
    captionsDelay: 250
});

form.addEventListener('submit', handleSubmit);

async function handleSubmit(evt) {
    evt.preventDefault();

    lightbox.refresh()
    searchQuery = form.elements.searchQuery.value;
    gallery.innerHTML = '';
    currentPage = 1;

    Notiflix.Loading.circle('Loading...');

    try {
        Notiflix.Loading.remove();
        const { totalHits, hits } = await getData(searchQuery, currentPage);
        maxPages = Math.ceil(totalHits / 40);

        if (totalHits === 0 || searchQuery.trim() === '') {
            Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.")
            return;
        }
        gallery.insertAdjacentHTML('beforeend', createMarkup(hits))
        if (!firstSearch) {
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
        }
        lightbox.refresh();
        if (currentPage < maxPages) {
            observer.observe(loadMore)
        }

        
    } catch (error) {
        Notiflix.Loading.remove();

        Notiflix.Notify.failure(error.message);
    }
    firstSearch = false;
}

async function handlePagination(entries, observer) {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            currentPage += 1;

            if (currentPage >= maxPages) {
                observer.unobserve(entry.target);
                Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.")
            }
            try {
                const data = await getData(searchQuery, currentPage);
                
                gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
                lightbox.refresh();      
            } catch (error) {
                Notiflix.Notify.failure(error.message);
            }
        }
    }
}