let accounts = [
	{
		username: 'Иван Петров',
		number: '0000000',
		pin: '0000',
		balance: 1240,
		transactions: [
			{
				sum: -140,
				date: getFormatedDate(new Date('2023.03.01 11:38:23'))
			},
			{
				sum: -120,
				date: getFormatedDate(new Date('2023.03.02 13:28:43'))
			},
			{
				sum: -80,
				date: getFormatedDate(new Date('2023.03.02 15:18:25'))
			},
			{
				sum: 820,
				date: getFormatedDate(new Date('2023.03.03 16:08:53'))
			},
			{
				sum: -40,
				date: getFormatedDate(new Date('2023.03.04 12:18:53'))
			},
			{
				sum: -88,
				date: getFormatedDate(new Date('2023.03.04 14:07:53'))
			}
		]
	},
	{
		username: 'Олег Сидоров',
		number: '1111111',
		pin: '1111',
		balance: 3040,
		transactions: [
			{
				sum: 140,
				date: getFormatedDate(new Date('2023.03.01 11:38:23'))
			},
			{
				sum: 120,
				date: getFormatedDate(new Date('2023.03.02 13:28:43'))
			},
			{
				sum: -80,
				date: getFormatedDate(new Date('2023.03.02 15:18:25'))
			},
			{
				sum: -840,
				date: getFormatedDate(new Date('2023.03.03 16:08:53'))
			}
		]
	}
]

let currentAccount = null

const loginForm = document.forms.login
const transferForm = document.forms.transfer
const loanForm = document.forms.loan
const removerForm = document.forms.remover

const clearDataButton = document.querySelector('.greetings__logout')
const accountBox = document.querySelector('.account')

const usernameBox = document.querySelector('.greetings__username')
const sumBox = document.querySelector('.balance__sum')
const dateBox = document.querySelector('.balance__date')
const infoBox = document.querySelector('.info__container')
const totalDeposit = document.querySelector('.results__deposit')
const totalWithdrawal = document.querySelector('.results__withdrawal')

clearDataButton.addEventListener('click', leaveAccount)
loginForm.addEventListener('submit', logIn)
transferForm.addEventListener('submit', sendMoney)
loanForm.addEventListener('submit', getMoney)
removerForm.addEventListener('submit', removeAccount)

function logIn(e){
	e.preventDefault()
	const account = accounts.find((account)=>account.number === loginForm.number.value && account.pin === loginForm.pin.value)
	if(!account) return
	loginForm.classList.toggle('hidden')
	accountBox.classList.toggle('hidden')
	currentAccount = account
	loadData()
	loginForm.reset()
}

function leaveAccount(){
	clearData()
	loginForm.classList.toggle('hidden')
	accountBox.classList.toggle('hidden')
	currentAccount = null
}

function clearData(){
	usernameBox.innerText = ''
	sumBox.innerText = ''
	dateBox.innerText = ''
	infoBox.innerHTML = ''
	totalDeposit.innerText = ''
	totalWithdrawal.innerText = ''
		
	transferForm.reset()
	loanForm.reset()
	removerForm.reset()

}

function getFormatedDate(rowDate){
	const formatedDate = {
		hours: rowDate.getHours().toString().padStart(2,'0'),
		minutes: rowDate.getMinutes().toString().padStart(2,'0'),
		day: rowDate.getDate().toString().padStart(2,'0'),
		month: (rowDate.getMonth()+1).toString().padStart(2,'0'),
		year: rowDate.getFullYear()
	}
	return `${formatedDate.hours}:${formatedDate.minutes} ${formatedDate.day}.${formatedDate.month}.${formatedDate.year}`
}

function loadData(){
	clearData()
	usernameBox.append(currentAccount.username)
	sumBox.append(currentAccount.balance)

	dateBox.append(getFormatedDate(new Date()))

	for (const transaction of currentAccount.transactions) {		
		let transactionType = (transaction.sum > 0) ? { modName:'blue', viewedType: 'Депозит'} : { modName:'red', viewedType: 'Перевод'}

		infoBox.innerHTML += `
		<div class='info__transaction'>
			<time class='info__date'>${transaction.date}</time>
			<p class='info__sum'>
				${transaction.sum}
				<span class='info__type info__type_${transactionType.modName}'>${transactionType.viewedType}</span>
			</p>
		</div>`
	}

	totalDeposit.innerText = currentAccount.transactions.reduce( (acc, current)=> acc += (current.sum>0) ? current.sum : 0, 0)
	totalWithdrawal.innerText = currentAccount.transactions.reduce( (acc, current)=> acc += (current.sum<0) ? current.sum : 0, 0) 
}


function sendMoney(e){
	e.preventDefault()
	const sendingSum =  transferForm.sum.value
	if(sendingSum <0 || sendingSum > currentAccount.balance){
		alert('Недостаточно средств')
		return
	}
	
	let receiver = accounts.find(value=> value.number === transferForm.number.value)

	if(transferForm.number.value === currentAccount.number || !receiver ){
		alert('Неверный номер аккаунта')
		return	
	}
	receiver.balance += +sendingSum
	currentAccount.balance -= sendingSum
	const transactionDate = getFormatedDate(new Date())
	receiver.transactions.push({sum: +sendingSum, date: transactionDate})
	currentAccount.transactions.push( {sum: -(+sendingSum),  date: transactionDate} )
	loadData()
}

function getMoney(e){
	e.preventDefault()
	const loanSum = loanForm.sum.value
	if(loanSum<=0) return
	currentAccount.balance += +loanSum
	const transactionDate = getFormatedDate(new Date())
	currentAccount.transactions.push( {sum: +loanSum,  date: transactionDate} )
	loadData()
}

function removeAccount(e){
	e.preventDefault()
	const account = accounts.findIndex((account)=>account.number === currentAccount.number && account.pin === removerForm.pin.value)
	if(account===-1){
		alert('Неверный пин-код')
		return
	}
	const isAgree = confirm('Вы точно хотите удалить счет?')
	if(isAgree)	accounts.splice(account, 1)
	console.log(accounts);
	leaveAccount()
}