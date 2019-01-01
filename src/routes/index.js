import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import CustomerLogin from '../components/CustomerLogin.vue';
import HomePage from '../components/HomePage.vue';
import CustomerRegister from '../components/CustomerRegister.vue';

import Customer from '../components/Customer/index.vue';
import CustomerProfile from '../components/ProfilePage.vue';
import CustomerEvents from '../components/Customer/Events/EventsPage.vue';
import CustomerTickets from '../components/Customer/Purchases/index.vue'
import EditEvent from '../components/Customer/Events/EditEvent.vue'
import CustomerEventList from '../components/Customer/Events/CustomerEventList.vue'
import Qrcodereader from '../components/QrcodeReader.vue'

import EventView from '../components/EventView.vue'
import TicketManager from '../components/TicketManager.vue'
import GuestListManager from '../components/GuestListManager.vue'
import GuestListManagerNewInvites from '../components/GuestListManagerNewInvites.vue'
import GuestListHistoryManager from '../components/GuestListHistoryManager.vue'
import InvoiceView from '../components/Customer/Purchases/Invoice.vue' /////*****
import PurchasedTickets from '../components/Customer/Purchases/PurchasedTickets.vue'
import CustomerPreferences from '../components/Customer/Preferences/preferences.vue'
import PurchasesIndex from '../components/Customer/Purchases/index.vue'
import EventStats from '../components/Customer/Events/EventStats.vue'
import ConfirmRsvp from '../components/Customer/Invites/ConfirmRsvp.vue'

import PasswordReset from '../components/Utilities/PasswordReset.vue'

let routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/login',
    name: 'CustomerLogin',
    component: CustomerLogin
  },
  {
    path: '/Register',
    name: 'CustomerRegister',
    component: CustomerRegister
  },
  {
    path: '/ResetPassword',
    name: 'PasswordReset',
    component: PasswordReset
  },
  {
    path: '/invite/:invite_id/rsvp_confirm',
    name: 'ConfirmRsvp',
    component: ConfirmRsvp
  },
  {
    path: '/customer/:email',
    component: Customer,
    meta: { requiresAuth: true },
    children: [
      {
        path:'profile',
        name: 'CustomerProfile',
        component: CustomerProfile,
        meta: { requiresAuth: true },
      },
      {
        path: 'preferences',
        name: 'CustomerPreferences',
        props: true,
        component: CustomerPreferences,
        meta: { requiresAuth: true }
      },
      {
        path:'events',
        name: 'CustomerEvents',
        component: CustomerEvents,
        meta: { requiresAuth: true },
        children: [
          {
            path: 'eventlist',
            name: 'CustomerEventList',
            component: CustomerEventList,
            meta: { requiresAuth: true }
          },
          {
            path:'manageTickets/:eventId',
            name: 'ManageTickets',
            component: TicketManager,
            props: true,
            meta: { requiresAuth: true },
          },
          {
            path: 'ticket-guest-list/:ticketId',
            name: 'TicketGuestList',
            component: GuestListManager,
            props: true,
            meta: {
              requiresAuth: true
            },
            children: [
              {
                path: 'new-invites',
                name: 'GuestListManagerNewInvites',
                component: GuestListManagerNewInvites,
                props: true,
                meta: {
                  requiresAuth: true
                }
              },
              {
                path: 'list-history',
                name: 'TicketGuestListHistory',
                component: GuestListHistoryManager,
                props: true,
                meta: {
                  requiresAuth: true
                }
              }
            ]
          },
          {
            path: 'scanTicket',
            name: 'QrReader',
            props: true,
            component: Qrcodereader,
            meta: { requiresAuth: true },
          }
        ]
      },
      {
        path: '',
        component: PurchasesIndex,
        meta: { requiresAuth: true },
        children: [
          {
            path: '',
            name: 'CustomerTickets',
            component: PurchasedTickets,
            meta: { requiresAuth: true }
          },
          {
            path: 'invoice/:invoiceId',
            name: 'FindInvoice',
            component: InvoiceView,
            props: true,
            meta: { requiresAuth: true }
          }
        ]
      }
    ]
  },
  {
    path: '/customer/:email/edit/:eventkey',
    name: 'EditEvent',
    component: EditEvent,
    meta: { requiresAuth: true },
  },
  {
    path: '/customer/:email/stats/:eventkey',
    name: 'EventStats',
    component: EventStats,
    meta: { requiresAuth: true }
  },
  {
    path: '/publicEvent/:email/:eventkey',
    name: 'EventView',
    component: EventView
  }
]

export default new Router({
  routes
});
