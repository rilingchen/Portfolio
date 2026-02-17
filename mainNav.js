// When hover over name, changes it to the pronounciation, with pinyin, with chinese characters
const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const firstNameOps = ['riling', 'rìlíng', '日凌'];
const lastNameOps = ['chen', 'chén', '陈'];
let index = 0;

firstName.addEventListener('mouseover', () => {
    index = (index + 1) % firstNameOps.length;
    firstName.textContent = firstNameOps[index];
    console.log(index);
});

lastName.addEventListener('mouseover', () => {
    index = (index + 1) % lastNameOps.length;
    lastName.textContent = lastNameOps[index];
});