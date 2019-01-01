import axios from 'axios'
export default {
  namespaced: true,
  state: {
    user: {}, //customer information
    Events: [], // customer events
    Invoices: [], // customer purchases
    selected_invoice: {} // ivoice info customer is about to redeem
  },
  mutations: {
    login (state, userData) {
      state.user = userData
    },
    logOut (state) {
      state.user = {},
      state.Events = [],
      state.Invoices = []
    },
    updateUser (state, user) {
      state.user = user
    },
    updateEvents (state, eventPayload) {
      state.Events = eventPayload
    },
    updateInvoices (state, invoicePayload) {
      state.Invoices = invoicePayload
    },
    updateSelectedInvoice (state, invoicePayload) {
      state.selected_invoice = invoicePayload
    }
  },
  getters: {
    CreatedTickets: (state) => {
      let customerEvents = state.Events
      let ticketContainer = []
      customerEvents.forEach((events) => {
        if (events.tickets != null) {
          events.tickets.forEach((ticket) => {
            ticketContainer.push(ticket)
          })
        }
      })

      return ticketContainer
    },
    userEventByKey: (state) => (key) => {
      return state.Events.find(function (eventObj) {
        /* eslint-disable no-console */
        if (eventObj._id === key) {
          return eventObj;
        }
        /* eslint-enable no-console */
      })
    },

    Invoices: (state) => {
      return state.Invoices
    },
  },
  actions: {
    // create a ticket for sale and the return to the list
    CreatedTicket (context, ticketData) {
      return new Promise(function(resolve, reject) {

      });
    },
    LoginUser (context, userData) {
      // created my first promise
      return new Promise((resolve, reject) => {
        axios.create({
          withCredentials: true
        }).post(process.env.VUE_APP_API_URL+'/Customer/login', userData)
        .then(response => {
          if (response.data.success) {
            context.commit('login', response.data.user);
            context.dispatch('initCustomerEvents')
            context.dispatch('initCustomerInvoices')
            resolve({
              success: true,
              status: 200,
              data: response.data
            })
          }
        })
        .catch(e => {
          if (e.request.status == 401) {
            reject({
              success: false,
              status: 401,
              message: "Unauthorized"
            })
          }
        })
      });
    },

    initCustomerEvents (context) {
      return new Promise ((resolve, reject) => {
        let url = process.env.VUE_APP_API_URL+'/'+context.state.user.email+'/events'
        axios.create({
          withCredentials: true
        }).get(url).then((response) => {
          context.commit('updateEvents', response.data.data)
          resolve(response)
        }).catch((e) => {
          reject(e)
        })
      })
    },

    initCustomerInvoices (context) {
      return new Promise ((resolve, reject) => {
        let url = process.env.VUE_APP_API_URL+'/'+context.state.user.email+'/invoices'
        axios.create({
          withCredentials: true
        }).get(url).then((response) => {
          console.log(response.data);
          context.commit('updateInvoices', response.data.data)
          resolve(response)
        }).catch((e) => {
          reject(e)
        })
      })
    },

    deleteCustomerInvoice (context, invoice_id)  {
      return new Promise ((resolve, reject) => {
        let url = process.env.VUE_APP_API_URL + '/invoice/' + invoice_id + '/delete'
        axios.create({
          withCredentials: true
        }).get(url).then((response) => {
          //success
          if (response.data.success) {
            let current_invoices = context.state.Invoices
            let index_position = current_invoices.findIndex((element) => {
              if (element._id == invoice_id) {
                return true
              }
              return false
            })

            if (index_position != -1) {
              current_invoices.splice(index_position, 1)
              context.commit('updateInvoices', current_invoices)
              resolve({
                success: true,
                message: "Invoice Deleted"
              })
            }
          }
        }).catch( (e) => {
          reject(e)
        })
      })
    },

    UpdateEvents(context, eventData){
      let currentFlyers = context.state.Events
      let currentPosition = "notFound"
      for (var i = 0; i < currentFlyers.length; i++) {
        if (currentFlyers[i]._id == eventData._id) {
          currentPosition = i
          currentFlyers.splice(i, 1)
        }
      }
      if (currentPosition != "notFound") {
        currentFlyers[currentPosition] = eventData
      } else {
        currentFlyers.push(eventData)
      }

      context.commit('updateEvents', currentFlyers)
    },
    RemoveEvent (context, eventkey){
      let currentEvents = context.state.Events
      let current_position = currentEvents.find(function(array_element) {
        if (array_element._id == eventkey) {
          return true
        }
      })
      let deleted_elements = currentEvents.splice(current_position, 1)
      if (deleted_elements.length > 0) {
        context.commit('updateEvents', currentEvents)
        return true
      } else {
        return false
      }
    },

    AddInvoice (context, invoiceData){
      let currentInvoices = context.state.Invoices
      currentInvoices.push(invoiceData)
      context.commit('updateInvoices', currentInvoices)
    },

    PublishEvent (context, eventId) {
      return new Promise(function(resolve, reject) {
        axios.create({
          withCredentials: true
        }).get(process.env.VUE_APP_API_URL + '/events/'+eventId+'/publish').then((response) => {
          context.dispatch('UpdateEvents', response.data.updatedEvent)
          resolve(response.data)
        }).catch((e) => {
          reject(e)
        })
      });
    },

    CancelEvent (context, eventId) {
      return new Promise(function(resolve, reject) {
        axios.create({
          withCredentials: true
        }).get(process.env.VUE_APP_API_URL + '/events/'+eventId+'/cancel').then((response) => {
          context.dispatch('UpdateEvents', response.data.updatedEvent)
          resolve(response.data)
        }).catch((e) => {
          reject(e)
        })
      });
    },

    Update (context, updateInfo) {
      return new Promise(function(resolve, reject) {
        let UpdateUrl = process.env.VUE_APP_API_URL + '/Customer/updateInfo'

        axios.create({
          withCredentials: true
        }).post(UpdateUrl, updateInfo).then((response) => {
          if (response.data.success) {
            context.commit('updateUser', response.data.user)
            resolve(response.data)
          }
        }).catch((e) => {
          reject(e)
        })
      });
    },

    ChangePic (context, uploadInfo) {
      return new Promise(function(resolve, reject) {
        let url = process.env.VUE_APP_API_URL + '/Customer/new_profile_picture'
        axios({
          url: url,
          withCredentials: true,
          data: uploadInfo,
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          context.commit('updateUser', response.data.user)
          resolve(response.data)
        }).catch((e) => {
          // console.error(e);
          reject(e)
        })
      });
    },

    LogOut (context) {
      context.commit('logOut')
    },

    DeleteEventTicket (context, ticket) {
      let url = process.env.VUE_APP_API_URL+'/events/'+ticket.eventId+'/ticket/'+ticket._id+'/deleteTicket'
      return new Promise((resolve, reject) => {
        axios.create({
          withCredentials: true
        }).get(url).then(response => {
          resolve (response)
        }).catch(e => {
          reject (e)
        })
      })
    },

    DropEventTicket (context, ticket) {
      let subject_event_index = context.state.Events.findIndex((element) => {
        if (element._id == ticket.eventId) {
          return true
        } else {
          return false
        }
      })

      if (subject_event_index != -1) {
        let evt = context.state.Events[subject_event_index]
        let current_tickets = evt.tickets
        let current_ticket_position = current_tickets.findIndex((element) => {
          if (element._id == ticket._id) {
            return true
          } else {
            return false
          }
        })

        if (current_ticket_position != -1) {
          current_tickets.splice(current_ticket_position, 1)
          context.dispatch('UpdateEvents', evt) // reset the events array
          return {
            success: true,
            message: 'Ticket Deleted, Event Updated'
          }
        } else {
          return {
            success: false,
            message: 'Ticket Not Found, Event Not Updated'
          }
        }
      }
    },

    AddEventTicket (context, ticket) {
      //Step 1) Find the event
      let subject_event_index = context.state.Events.findIndex((element) => {
        if (element._id == ticket.eventId) {
          return true
        } else {
          return false
        }
      })

      if (subject_event_index != -1) {
        let evt = context.state.Events[subject_event_index] //We have found the event
        let current_tickets = evt.tickets // Step 2 get its tickets
        let current_ticket_position = current_tickets.findIndex((element) => {
          if (element._id == ticket._id) {
            return true
          } else {
            return false
          }
        })

        if (current_ticket_position === -1) {
          evt.tickets.push(ticket)
          context.dispatch('UpdateEvents', evt)
          return {
            success: true,
            message: 'Ticket Added, Event Updated'
          }
        } else {
          return {
            success: false,
            message: 'Ticket Exists, Try Editing'
          }
        }
      }
    },

    FindInvoice (context, invoiceId) {
      return new Promise(function(resolve, reject) {
        let url = process.env.VUE_APP_API_URL + '/invoice/' + invoiceId
        axios.create({
          withCredentials: true
        }).get(url).then((response) => {
          context.commit('updateSelectedInvoice', response.data)
          resolve({
            success: true,
          })
        }).catch((e) => {
          reject(e)
        })
      });
    }
  }
}
