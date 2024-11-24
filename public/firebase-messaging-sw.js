// self.addEventListener("push", (event) => {
//   const data = event.data.json();
//   const options = {
//     title: data.notification.title,
//     body: data.notification.body,
//     badge: "/logo.png",
//     requireInteraction: true,
//     data: {
//       url: `${process.env.NEXT_PUBLIC_WEBSITE_URL_DEV}/dashboard/inbox`
//     }
//   };

//   event.waitUntil(
//     self.registration.showNotification(data.notification.title, options)
//   );
// });

// self.addEventListener('notificationclick', event => {
//   const notificationData = event.notification.data;

//   if (notificationData.url) {
//     clients.openWindow(notificationData.url);
//   }
//   event.notification.close();
// });