export const SHOW_MODAL = 'SHOW_MODAL';
export const SHOW_STATIC_MODAL = 'SHOW_STATIC_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const HIDE_STATIC_MODAL = 'HIDE_STATIC_MODAL';

export const showModal = message => ({
    type: SHOW_MODAL,
    message
}) ;

export const showStaticModal = message => ({
    type: SHOW_STATIC_MODAL,
    message
});

export const hideModal = () => ({
    type: HIDE_MODAL
});

export const hideStaticModal = () => ({
    type: HIDE_STATIC_MODAL
});