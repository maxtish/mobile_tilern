import Tts from 'react-native-tts';

/**
 * Озвучка текста через react-native-tts
 */
export const speakText = (word: string, rate: number = 0.5) => {
  if (!word) return;

  // Останавливаем текущую речь
  Tts.stop();

  // Настраиваем параметры (можно вызывать один раз при старте, но так надежнее)
  Tts.setDefaultLanguage('de-DE');
  Tts.setDefaultRate(rate / 2); // 0.5 - нормальная скорость для этой либы

  // Запуск
  Tts.speak(word);
};
