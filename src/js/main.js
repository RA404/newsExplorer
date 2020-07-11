//импортируем стили
import '../pages/mainPage/index.css';

//импортируем константы
import { authorizationButtons, popupCloseButton } from './constants/buttons';
import { popupLogin, popupSignup, popupRegistered } from './constants/popups';
import { overlayList } from './constants/overlays';
import { mobileMenuToggler } from './constants/menus';

// Импортируем функции и вспомогательные обработчики
import setClickListenersToListOfDOM from './utils/handlers';

//всем кнопкам авторизации устанавливаем событие на клик "открыть попап регистрации" и закроем мобильное меню, чтобы не перекрывало
setClickListenersToListOfDOM(authorizationButtons, () => {
  popupSignup.open();
  mobileMenuToggler.checked = false;
});

//всем кнопкам закрытия попапа устанавливаем событие на клик "закрыть попап"
setClickListenersToListOfDOM(popupCloseButton, () => {
  popupSignup.close();
  popupLogin.close();
  popupRegistered.close();
});

//всем оверлэям устанавливаем событие на клик "закрыть попап"
setClickListenersToListOfDOM(overlayList, () => {
  popupSignup.close();
  popupLogin.close();
  popupRegistered.close();
});
