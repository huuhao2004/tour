const initTinyMCE = (id) => {
  tinymce.init({
  selector: id || '[textarea-mce]',
  plugins: 'charmap codesample',
  toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | charmap | codesample',
}); 
}

initTinyMCE();