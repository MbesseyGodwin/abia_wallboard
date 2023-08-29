// get the form element
const form = document.querySelector('.form');

// listen for the form submit event
form.addEventListener('submit', function (event) {
    event.preventDefault();

    // get the file input elements
    const viralloadInput = document.getElementById('viralload');

    // get the selected linelist value
    const linelistValue = document.querySelector('input[name="linelist"]:checked').value;

    // check if both files are selected
    if (!viralloadInput.files.length || !linelistValue) {
        alert('Please select both Viral Load file and Linelist.');
        return;
    }

    // check if the selected file is a CSV file
    if (!checkFileType(viralloadInput.files[0], '.csv')) {
        alert('Please select a CSV file.');
        return;
    }

    // perform additional checks on the selected files if required

    // submit the form if all checks pass
    form.submit();
});

// listen for file input change events
document.querySelectorAll('.custom-file-input').forEach(function (input) {
    input.addEventListener('change', function (event) {
        // get the selected file name
        const fileName = event.target.files[0].name;
        // update the corresponding label text
        const label = this.nextElementSibling;
        label.innerHTML = fileName;
    });
});

// helper function to check if a file has a valid type
function checkFileType(file, types) {
    const acceptedTypes = types.split(',').map(type => type.trim());
    const fileNameParts = file.name.split('.');
    const fileExtension = fileNameParts[fileNameParts.length - 1];
    return acceptedTypes.includes('.' + fileExtension);
}
