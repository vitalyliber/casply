export const setupNotifications = () => {
  navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
    serviceWorkerRegistration.pushManager.getSubscription()
      .then(function(subscription) {
        if (subscription) {
          return subscription;
        }
        return serviceWorkerRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: window.vapidPublicKey
        });
      }).then(function(subscription) {
      sendKeys(subscription.toJSON(), null, null)
    });
  });
}

export const sendKeys = (subscription, successCb, failureCb) => {
  const token = document.querySelector("meta[name=csrf-token]").content || ''

  fetch(`/push_notification_subscriptions`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'X-CSRF-Token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subscription: subscription
    }),
  })
    .then(response => response.json())
    .then(successCb)
    .catch(failureCb);
}

setTimeout(() => {
  if (gon.is_user_signed_in) {
    setupNotifications()
  }
}, 2000);
