const initTinyMCE = (id) => {
  tinymce.init({
  selector: id || '[textarea-mce]',
  plugins: 'charmap codesample image',
  toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | charmap | codesample',
  images_upload_url: `/${pathAdmin}/upload/image` // khi upload ảnh thì sẽ call đến api này bên be
}); 
}

initTinyMCE();