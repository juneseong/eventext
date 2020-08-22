import React, { useState, useEffect } from 'react';

import './giphy-modal.styles.scss';

import Button from '../custom-button/custom-button.component';
import GiphyItems from '../giphy-items/giphy-items.component';

const GiphyModal = ({ closeGiphyModal, setMedia, media }) => {
    const [modalActive, setModalActive] = useState('');
    const [data, setData] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [currentGiphy, setCurrentGiphy] = useState(media);

    useEffect(() => {
        setModalActive('active');

        fetch(`http://api.giphy.com/v1/gifs/trending?api_key=${process.env.REACT_APP_API_KEY}&limit=9`)
            .then(response => response.json())
            .then(response => setData(response.data));
    }, []);

    const searchGiphy = () => {
        fetch(`http://api.giphy.com/v1/gifs/search?q=${searchInput}&api_key=${process.env.REACT_APP_API_KEY}&limit=9`)
            .then(response => response.json())
            .then(response => {
                if (response.data.length > 0) {
                    setData(response.data);
                } else {
                    fetch(`http://api.giphy.com/v1/gifs/trending?api_key=${process.env.REACT_APP_API_KEY}&limit=9`)
                        .then(response => response.json())
                        .then(response => setData(response.data));
                }
            });
    };

    const handleSubmit = e => {
        e.preventDefault();

        setMedia(currentGiphy);
        closeGiphyModal();
    };

    return (
        <div className='giphy-modal' onClick={closeGiphyModal}>
            <div className={`giphy-container ${modalActive}`} onClick={e => e.stopPropagation()}>
                <div className='close-button' onClick={closeGiphyModal}>
                    <i className='fas fa-times'></i>
                </div>
                <div className='search-bar'>
                    <input 
                        type='text' 
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)} 
                        onKeyPress={e => e.key === 'Enter' ? searchGiphy() : null}
                        placeholder='Search'
                    />
                    <i className='fas fa-search' onClick={searchGiphy}></i>
                </div>
                <div className='giphy-items-container'>
                    {data ? data.map(giphy => <GiphyItems key={giphy.id} giphy={giphy} currentGiphy={currentGiphy} setCurrentGiphy={setCurrentGiphy} />) : null}
                </div>
                <div className='giphy-modal-footer'>
                    <div className='add-giphy-button'>
                        <Button action={handleSubmit} color='blue'>Add</Button>
                    </div>
                    <div className='giphy-logo'>
                        Powered by GIPHY
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiphyModal;