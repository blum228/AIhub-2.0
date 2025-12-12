import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'AI Catalog CIS' }
  },
  collections: {
    tools: collection({
      label: 'AI Сервисы',
      slugField: 'title',
      path: 'src/content/tools/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Название' } }),
        shortDescription: fields.text({
          label: 'Краткое описание',
          validation: { isRequired: true, length: { min: 10, max: 200 } }
        }),
        coverImage: fields.image({
          label: 'Обложка',
          directory: 'public/images/tools',
          publicPath: '/images/tools/'
        }),
        gifPreview: fields.image({
          label: 'GIF превью (опционально)',
          directory: 'public/images/tools',
          publicPath: '/images/tools/'
        }),
        tags: fields.multiselect({
          label: 'Теги',
          options: [
            { label: 'Чат-бот', value: 'chatbot' },
            { label: 'Генерация изображений', value: 'image-gen' },
            { label: 'Видео', value: 'video' },
            { label: 'Telegram бот', value: 'telegram-bot' },
            { label: 'Понимает русский', value: 'russian' },
            { label: 'Карты РФ', value: 'russian-cards' },
            { label: 'Крипто', value: 'crypto' },
            { label: 'Без VPN', value: 'no-vpn' }
          ]
        }),
        priceModel: fields.select({
          label: 'Модель оплаты',
          options: [
            { label: 'Бесплатно', value: 'free' },
            { label: 'Freemium', value: 'freemium' },
            { label: 'Платно', value: 'paid' }
          ],
          defaultValue: 'freemium'
        }),
        isNsfw: fields.checkbox({ label: 'NSFW контент', defaultValue: true }),
        affiliateLink: fields.url({ label: 'Партнёрская ссылка', validation: { isRequired: true } }),
        rating: fields.number({
          label: 'Рейтинг (0-5)',
          validation: { min: 0, max: 5 }
        }),
        acceptsRussianCards: fields.checkbox({
          label: 'Принимает карты РФ',
          defaultValue: false
        }),
        requiresVpn: fields.checkbox({
          label: 'Требует VPN',
          defaultValue: true
        }),
        supportsRussian: fields.checkbox({
          label: 'Поддержка русского языка',
          defaultValue: false
        }),
        telegramBotLink: fields.text({
          label: 'Ссылка на Telegram бота (для telegram-bot тега)'
        }),
        paymentMethods: fields.multiselect({
          label: 'Способы оплаты',
          options: [
            { label: 'Visa/Mastercard', value: 'card' },
            { label: 'Криптовалюта', value: 'crypto' },
            { label: 'PayPal', value: 'paypal' },
            { label: 'Qiwi', value: 'qiwi' },
            { label: 'ЮMoney', value: 'yoomoney' }
          ]
        }),
        faq: fields.array(
          fields.object({
            question: fields.text({ label: 'Вопрос' }),
            answer: fields.text({ label: 'Ответ', multiline: true })
          }),
          { label: 'FAQ', itemLabel: props => props.fields.question.value }
        ),
        publishedAt: fields.date({ label: 'Дата публикации' }),
        content: fields.mdx({ label: 'Полное описание' })
      }
    })
  }
});
