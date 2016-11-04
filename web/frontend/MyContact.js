/**
 * Created by tup1tsa on 04.11.2016.
 */
export default class  {

    constructor (jsonData) {
        this.data = JSON.parse(jsonData);
        this.userData = this.data['userData'];
        this.countries = this.data['countries']
    }

    findLastId () {
        this.maxPhoneId = 1;
        this.maxEmailId = 1;
        this.userData['phones'].forEach(phone => {
            if (phone['phone_id'] > this.maxPhoneId) {
                this.maxPhoneId = phone['phone_id']
            }
        });
        this.userData['emails'].forEach(email => {
            if (email['email_id'] > this.maxEmailId) {
                this.maxEmailId = email['email_id']
            }
        })
    }

    addHandlersToButtons () {
        $('#addPhone').click(() => {
            this.addPhone()
        });
        $('#addEmail').click(() => {
            this.addEmail()
        });
        $('#myContactSubmit').click(() => {
            this.saveData()
        })
    }

    generatePhoneId() {
        this.maxPhoneId++;
        return this.maxPhoneId
    }

    generateNewEmailId() {
        this.maxEmailId++;
        return this.maxEmailId
    }

    addPhone() {
        const id = this.generatePhoneId();
        this.userData['phones'].push({
            phone_id: id,
            phone: '',
            public: 'false'
        });
        const phoneHTML = MyContact.generatePhoneEmailRow(id, '', 'false', 'phone');
        MyContact.appendPhoneHTML(phoneHTML)
    }

    addEmail () {
        const id = this.generateNewEmailId();
        this.userData['emails'].push({
            email_id: id,
            email: '',
            public: 'false'
        });
        const emailHTML = MyContact.generatePhoneEmailRow(id, '', 'false', 'email');
        MyContact.appendEmailHTML(emailHTML)
    }

    updateContactData() {
        let contact = this.userData['mainData'][0];
        contact['address'] = MyContact.getInputValue('#address');
        contact['country_code'] = MyContact.getInputValue('#countryCode');
        contact['first_name'] = MyContact.getInputValue('#firstName');
        contact['last_name'] = MyContact.getInputValue('#lastName');
        contact['zip_city'] = MyContact.getInputValue('#zipCity');
        contact['isVisible'] = MyContact.getCheckboxValue('#isPublic');
    }

    updatePhonesData() {
        this.userData['phones'] = this.userData['phones'].map(item => {
            const id = item[`phone_id`];
            const inputSel = `#phone${id} [type="text"]`;
            const checkSel = `#phone${id} [type="checkbox"]`;
            return {
                'phone': MyContact.getInputValue(inputSel),
                'phone_id': id,
                'isPublic': MyContact.getCheckboxValue(checkSel)
            };
        });
    }

    updateEmailsData() {
        this.userData['emails'] = this.userData['emails'].map(item => {
            const id = item[`email_id`];
            const inputSel = `#email${id} [type="text"]`;
            const checkSel = `#email${id} [type="checkbox"]`;
            return {
                'email': MyContact.getInputValue(inputSel),
                'email_id': id,
                'isPublic': MyContact.getCheckboxValue(checkSel)
            };
        });
    }

    static getInputValue(selector) {
        return $(selector).val()
    }

    static getCheckboxValue(selector) {
        return $(selector).prop('checked') ? 'true' : 'false'
    }

    saveData () {
        this.updateContactData();
        this.updatePhonesData();
        this.updateEmailsData();
        $.ajax('index.php', {
            type: 'POST',
            data: {
                route: 'my-contact-update',
                userData: JSON.stringify(this.userData)
            }
        })
            .done((result)=> {

            },err=> {

            })
    }

    generateHTML () {
        const title = "<h1 class='header'>My Contact</h1>";
        const contact = this.generateContactHTML();
        const phones = this.generatePhonesHTML();
        const emails = this.generateEmailsHTML();
        const dataDiv = `<div id="userData">${contact+phones+emails}<div class="clear"></div></div>`;
        const submitBtn = MyContact.generateSubmitButton();
        const isVisible = MyContact.generatePublishBox(this.userData['mainData'][0]['isVisible']);
        return title+isVisible+dataDiv+submitBtn;

    }

    generateContactHTML() {
        const contact = this.userData['mainData'][0];
        const header = MyContact.generateHeader('Contact');
        const firstName = MyContact.generateContactRow('firstName', contact['first_name'], 'Firstname');
        const lastName = MyContact.generateContactRow('lastName', contact['last_name'], 'Lastname');
        const address = MyContact.generateContactRow('address', contact['address'], 'Address');
        const zipCity = MyContact.generateContactRow('zipCity', contact['zip_city'], 'ZIP/City');
        const country = MyContact.generateCountrySelect(contact['country_code'],this.countries);
        return `<div class="column left">${header+firstName+lastName+address+zipCity+country}</div>`
    }

    generatePhonesHTML () {
        const phones = this.userData['phones'];
        const header = MyContact.generateHeader('Phones');
        const phonesHtml = phones.map(phone => {
            return MyContact.generatePhoneEmailRow(phone['phone_id'], phone['phone'], phone['public'], 'phone')
        }).join('');
        const addPhoneBtn = MyContact.generateAddPhoneButton();
        return `<div class="column center"><div>${header+phonesHtml}</div>${addPhoneBtn}</div>`
    }

    generateEmailsHTML () {
        const emails = this.userData['emails'];
        const header = MyContact.generateHeader('Emails');
        const emailsHTML = emails.map(email => {
            return MyContact.generatePhoneEmailRow(email['email_id'], email['email'], email['public'], 'email')
        }).join('');
        const addEmailBtn = MyContact.generateAddEmailButton();
        return `<div class="column right"><div>${header+emailsHTML}</div>${addEmailBtn}</div>`
    }

    static generateSubmitButton () {
        return '<button type="button" id="myContactSubmit">Save</button>'
    }

    static generateAddPhoneButton() {
        return '<button type="button" id="addPhone">Add phone</button>'
    }

    static generateAddEmailButton() {
        return '<button type="button" id="addEmail">Add email</button>'
    }

    static generateHeader (data) {
        return `<h4>${data}</h4>`
    }

    static generateContactRow (id, inputValue, labelValue) {
        const label = `<label class="contact" for="${id}">${labelValue}</label>`;
        const input = `<input class="contact" id=${id} value="${inputValue}">`;
        return label+input+'<br>';
    }

    static generatePhoneEmailRow (id, value, isPublic, type) {
        const checkBoxValue = isPublic === 'true' ? 'checked' : "";
        const input = `<input type="text" value="${value}">`;
        const checkBox = `<input type="checkbox" ${checkBoxValue}>`;
        return `<div id="${type+id}">${input+checkBox}</div>`
    }

    static appendPhoneHTML (html) {
        $(html).insertBefore('#addPhone')
    }

    static appendEmailHTML(html) {
        $(html).insertBefore('#addEmail')
    }

    static generatePublishBox(isPublic) {
        const checkBoxValue = isPublic === 'true' ? 'checked' : "";
        const text = `<span>Publish my contact</span>`;
        const checkbox = `<input id="isPublic" type="checkbox" ${checkBoxValue}>`;
        return `<div id="isVisible">${text+checkbox}</div>`
    }

    static generateCountrySelect(value, countries) {
        const options = countries.map(countryData => {
            const code = countryData['country_code'];
            const selected = value === code ? 'selected' : '';
            return ` <option value="${code}" ${selected}>${code}</option>`
        }).join('');
        const select = `<select id="countryCode" class="contact">${options}</select>`;
        const label = `<label class="contact" for="userCountry">Country</label>`;
        return label+select;
    }

}
