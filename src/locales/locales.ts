import LocalizedStrings from 'react-native-localization';

export const strings = new LocalizedStrings({
  ru: {
    selectFarm: 'Выберите ферму, чтобы продолжить',
    lyubotin: 'Люботин',
    seredynka: 'Серединка',
    testServer: 'Тестовый сервер',
    continue: 'Продолжить',
    logIn: 'Войти',
    templates: 'Шаблоны',
    registration: 'Регистрация',
    giveQrCode: 'Выдать QR код',
    logout: 'Выйти из приложения',
    worker: 'Работник',
    username: 'Имя пользователя',
    firstName: 'Имя',
    lastName: 'Фамилия',
    middleName: 'Отчество',
    birthDate: 'Дата рождения',
    selectDate: 'Выберите дату...',
    fieldIsRequired: 'Это поле обязательно к заполнению.',
    maxUsernameCharacters: 'Максимальное количество символов для имени пользователя 20.',
    maxFirstNameCharacters: 'Максимальное количество символов для имени 20.',
    maxLastNameCharacters: 'Максимальное количество символов для фамилии 20.',
    maxMiddleNameCharacters: 'Максимальное количество символов для отчества 20.',
    minWeight: 'Минимальное значение 0.1',
    maxWeight: 'Максимальное значение 999999.99',
    scanQrCode: 'Сканировать QR код',
    goToGiveQrCode: 'Перейти к выдаче QR кода',
    mustBeNumber: 'Значение должно быть числом.',
    items: 'шт.',
    workerNotFound: 'Работник не найден.',
    registerWorker: 'Зарегистрировать работника',
    qrCodeNotFound: 'QR код не принадлежит системе.',
    qrCodeGiven: 'QR код уже выдан.',
    farmNotFound: 'Ферма не найдена.',
    toMain: 'На главную',
    toTemplates: 'К шаблонам',
    qrCodeInfo: 'Информация о QR коде',
    entrySaved: 'Запись сохранена',
    registerMore: 'Зарегестрировать еще',
    giveAnotherQrCode: 'Выдать другой QR код',
    scanQrCodeWithCamera: 'Поднесите QR код к камере',
    scanWorkerQrCodeWithCamera: 'Поднесите QR код работника к камере',
    hangOverHarvest: 'Сдать урожай',
    hangOverAnotherHarvest: 'Сдать ещё урожай',
    location: 'Локация',
    quality: 'Качество',
    package: 'Упаковка',
    numberOfBoxes: 'Кол-во ящиков',
    product: 'Продукт',
    harvestTemporarilyFixedForWorkerQrCode: 'Урожай временно зафиксирован за QR кодом работника',
    couldNotConnectToServer: 'Не удалось установить соединение с сервером. Приложение работает в автономном режиме.',
    appWorksOffline:
      'Приложение работает в оффлайн режиме. Данные будут синхронизированы после восстановления соединения.',
    noInternetConnection: 'Отсутствует подключение к Интеренету',
    logInOnline: 'Войдите в систему в он-лайн режиме хотя бы один раз, чтобы использовать приложение.',
    incorrectUsername: 'Неверное имя пользователя.',
    retry: 'Повторить',
    error: 'Ошибка',
    back: 'Назад',
    notActive: 'не активен',
    qrCodeNotIssuedToWorker: 'Данный QR код не выдан работнику.',
    issueQrCodeDate: 'Дата выдачи кода',
    weightKg: 'Вес, кг',
  },
});
