const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			auth: false,
			hoteles:[],
			housekeepers: [],
			maintenances: [],
			housekeeper_tasks: [],
			maintenancetasks: [],
			categories: [],
			rooms: [],
			token: localStorage.getItem("token") || null,
			hotel: JSON.parse(localStorage.getItem("hotel")) || null,
			},


		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			setCategories: (categories) => {
				setStore({ categories })
			},

			setRooms: (rooms) => {
				setStore({ rooms });
			},

			logout: () => {
				console.log("logout")
				localStorage.removeItem("token");
				setStore({ auth: false, token:null, hotel:null });
			},

			login: (email, password) => {
				const requestOptions = {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				};

				return fetch(process.env.BACKEND_URL + "/api/loginhotel", requestOptions)
					.then((response) => {
						if (response.status === 200) {
							return response.json().then(async (data) => {
								localStorage.setItem("token", data.access_token);
								setStore({ auth: true, token: data.access_token });

								// Llamar a getHotelInfo luego del login
								await getActions().getHotelInfo();

								return true;
							});
						} else {
							setStore({ auth: false });
							return false;
						}
					});
			},

			getHotelInfo: async () => {
				const store = getStore();
				const token = store.token;

				if (!token) return;

				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/hoteles_by_hotel", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: "Bearer " + token,
						},
					});

					if (response.ok) {
						const data = await response.json();
						setStore({ hotel: data });
						localStorage.setItem("hotel", JSON.stringify(data));
					} else {
						console.error("No se pudo obtener info del hotel");
					}
				} catch (error) {
					console.error("Error en getHotelInfo", error);
				}
			},

			signup: (nombre, email, password) => {
				const requestOptions = {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(
						{
							"nombre": nombre,
							"email": email,
							"password": password
						}
					)
				};

				fetch(process.env.BACKEND_URL + "/api/signuphotel", requestOptions)
					.then(response => response.text())
					.then((result) => console.log(result))

			},

			// Para hoteles
			getHoteles: async () => {
				try {
					const res = await fetch(process.env.BACKEND_URL + "/api/hoteles");
					const data = await res.json();
					setStore({ hoteles: data });
				} catch (error) {
					console.error("Error al obtener hoteles:", error);
				}
			},
			getHotelByToken: async () => {
				const store = getStore();
			
				try {
					const res = await fetch(process.env.BACKEND_URL + "/api/hoteles_by_hotel", {
						headers: {
							Authorization: "Bearer " + store.token
						}
					});
			
					if (!res.ok) throw new Error("Error al obtener hotel autenticado");
			
					const data = await res.json();
					setStore({ hoteles: [data] }); // ← Lo guardamos como array para poder usar `.map` sin errores
				} catch (error) {
					console.error("Error al obtener hotel autenticado:", error);
				}
			},
			
			
			updateAuthenticatedHotel: async (hotelData) => {
				const store = getStore();
				const res = await fetch(process.env.BACKEND_URL + "/api/hoteles_by_hotel", {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + store.token
					},
					body: JSON.stringify(hotelData)
				});
			
				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.msg || "Error al actualizar el hotel");
				}
			
				const updatedHotel = await res.json();
				setStore({ hotel: updatedHotel });
				localStorage.setItem("hotel", JSON.stringify(updatedHotel));
				return updatedHotel;
			},
			
			deleteAuthenticatedHotel: async () => {
				const store = getStore();
				const res = await fetch(process.env.BACKEND_URL + "/api/hoteles_by_hotel", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + store.token
					}
				});
			
				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.msg || "Error al eliminar el hotel");
				}
			
				localStorage.removeItem("token");
				localStorage.removeItem("hotel");
				setStore({ auth: false, token: null, hotel: null });
				return true;
			},
			createHotelAuthenticated: async (hotelData) => {
				const store = getStore();
				try {
				  const res = await fetch(process.env.BACKEND_URL + "/api/hoteles_by_hotel", {
					method: "POST",
					headers: {
					  "Content-Type": "application/json",
					  Authorization: "Bearer " + store.token
					},
					body: JSON.stringify(hotelData)
				  });
			  
				  if (!res.ok) throw new Error("Error al crear el hotel desde hotel autenticado");
				  const data = await res.json();
				  return data; // hotel creado
				} catch (err) {
				  console.error("Error en createHotelAuthenticated:", err);
				  throw err;
				}
			  },
			  
			

			// Para branches

			getBranches: async () => {
				const store = getStore();
				const res = await fetch(process.env.BACKEND_URL + "/api/branches_by_hotel", {
					headers: { Authorization: "Bearer " + store.token }
				});
				const data = await res.json();
				setStore({ branches: data });
			},
			
			createOrUpdateBranch: async (branchData, branchSeleccionado) => {
				const store = getStore();
				const method = branchSeleccionado ? "PUT" : "POST";
				const url = branchSeleccionado
					? `${process.env.BACKEND_URL}/api/branches_by_hotel/${branchSeleccionado.id}`
					: `${process.env.BACKEND_URL}/api/branches_by_hotel`;
			
				const res = await fetch(url, {
					method,
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + store.token,
					},
					body: JSON.stringify(branchData),
				});
				if (!res.ok) throw new Error("Error al crear o actualizar branch");
				return await res.json();
			},
			
			deleteBranch: async (id) => {
				const store = getStore();
				const res = await fetch(`${process.env.BACKEND_URL}/api/branches_by_hotel/${id}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + store.token,
					},
				});
				if (!res.ok) throw new Error("Error al eliminar branch");
			},
					  
			getRoomsByBranch: async (branchId) => {
				const store = getStore();
				const res = await fetch(process.env.BACKEND_URL + `/api/rooms_by_branch/${branchId}`, {
				  headers: { Authorization: "Bearer " + store.token }
				});
				const data = await res.json();
				setStore({ rooms: data });
			  },

			  // para rooms
			
				// Obtener todas las habitaciones del hotel autenticado
				getRooms: () => {
					const store = getStore();
					console.log("Token:", store.token);  // Verifica que el token esté presente
					fetch(process.env.BACKEND_URL + "/api/rooms_by_hotel", {
					  method: "GET",
					  headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + store.token, // Envía el token en el encabezado
					  },
					})
					  .then((response) => {
						if (!response.ok) {
						  throw new Error(`HTTP error! Status: ${response.status}`);
						}
						return response.json();
					  })
					  .then((data) => {
						console.log("Rooms fetched from API:", data); // Verifica los datos
						setStore({ rooms: data });  // Actualiza el estado con las habitaciones obtenidas
					  })
					  .catch((error) => {
						console.error("Error:", error);
					  });
				  },
				  
				
				// Crear o actualizar una habitación (POST si no existe, PUT si ya existe)
				createOrUpdateRoom: (roomData, roomSeleccionado) => {
					const store = getStore();
					const method = roomSeleccionado ? "PUT" : "POST";
					const url = roomSeleccionado
					  ? `${process.env.BACKEND_URL}/api/rooms_by_hotel/${roomSeleccionado.id}`
					  : `${process.env.BACKEND_URL}/api/rooms_by_hotel`;
				  
					return fetch(url, {
					  method,
					  headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + store.token, // Envía el token en el encabezado
					  },
					  body: JSON.stringify(roomData),
					})
					  .then((res) => {
						if (!res.ok) throw new Error("Error al crear o actualizar habitación");
						return res.json();
					  })
					  .then((data) => {
						// Si estamos creando una habitación, la agregamos al estado
						setStore({
						  rooms: roomSeleccionado
							? store.rooms.map((room) =>
								room.id === roomSeleccionado.id ? data : room
							  ) // Si estamos editando, actualizamos la habitación
							: [...store.rooms, data], // Si estamos creando, agregamos la nueva habitación
						});
						return data;
					  })
					  .catch((error) => {
						console.error("Error en createOrUpdateRoom:", error);
						throw error;
					  });
				  },
				  
				  
				// Eliminar una habitación
				deleteRoom: (id) => {
					const store = getStore();
					return fetch(`${process.env.BACKEND_URL}/api/rooms_by_hotel/${id}`, {
					  method: "DELETE",
					  headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + store.token, // Envía el token en el encabezado
					  },
					})
					  .then((res) => {
						if (!res.ok) throw new Error("Error al eliminar habitación");
				  
						// Actualiza el store eliminando la habitación borrada
						setStore({ rooms: store.rooms.filter((room) => room.id !== id) });
						return true;
					  })
					  .catch((error) => {
						console.error("Error en deleteRoom:", error);
						throw error;
					  });
				  },
			  
  

			  getHousekeepers: async () => {
				const store = getStore();
				const res = await fetch(process.env.BACKEND_URL + "/api/housekeepers_by_hotel", {
					headers: { Authorization: "Bearer " + store.token }
				});
				const data = await res.json();
				setStore({ housekeepers: data });
			},

			 // GET: Obtiene los mantenimientos del hotel autenticado
			 getMaintenances: () => {
				const store = getStore();
				console.log("Token que estoy enviando:", store.token);
				fetch(process.env.BACKEND_URL + "/api/maintenance_by_hotel", {
					method: "GET",
					headers: {
						Authorization: "Bearer " + store.token,
					},
				})
					.then((res) => {
						if (!res.ok) throw new Error("No se pudo obtener la lista de técnicos");
						return res.json();
					})
					.then((data) => {
						setStore({ maintenances: data });
					})
					.catch((err) => console.error("Error al obtener técnicos:", err));
			},
			
			postMaintenance: (maintenanceData) => {
				const store = getStore();
				fetch(process.env.BACKEND_URL + "/api/maintenance_by_hotel", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + store.token,
					},
					body: JSON.stringify(maintenanceData),
				})
					.then((res) => {
						if (!res.ok) throw new Error("No se pudo crear el técnico");
						return res.json();
					})
					.then((newTech) => {
						setStore({ maintenances: [...store.maintenances, newTech] });
					})
					.catch((err) => console.error("Error al crear técnico:", err));
			},
			
			putMaintenance: (id, maintenanceData) => {
				const store = getStore();
				fetch(process.env.BACKEND_URL + `/api/maintenance_by_hotel/${id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + store.token,
					},
					body: JSON.stringify(maintenanceData),
				})
					.then((res) => {
						if (!res.ok) throw new Error("No se pudo actualizar el técnico");
						return res.json();
					})
					.then((updatedTech) => {
						const updatedList = store.maintenances.map((t) =>
							t.id === updatedTech.id ? updatedTech : t
						);
						setStore({ maintenances: updatedList });
					})
					.catch((err) => console.error("Error al actualizar técnico:", err));
			},
			
			deleteMaintenance: (id) => {
				const store = getStore();
				fetch(process.env.BACKEND_URL + `/api/maintenance_by_hotel/${id}`, {
					method: "DELETE",
					headers: {
						Authorization: "Bearer " + store.token,
					},
				})
					.then((res) => {
						if (!res.ok) throw new Error("No se pudo eliminar el técnico");
						return res.json();
					})
					.then(() => {
						const newList = store.maintenances.filter((t) => t.id !== id);
						setStore({ maintenances: newList });
					})
					.catch((err) => console.error("Error al eliminar técnico:", err));
			},
			
			
			
			getHousekeeperTasks: async () => {
				const store = getStore();
				const res = await fetch(process.env.BACKEND_URL + "/api/housekeeper_tasks_by_hotel", {
					headers: { Authorization: "Bearer " + store.token }
				});
				const data = await res.json();
				setStore({ housekeeperTasks: data });
			},
			
			getMaintenanceTasks: async () => {
				const store = getStore();
				const res = await fetch(process.env.BACKEND_URL + "/api/maintenancetask_by_hotel", {
					headers: { Authorization: "Bearer " + store.token }
				});
				const data = await res.json();
				setStore({ maintenanceTasks: data });
			},
			
			
			  
			getMessage: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
					const data = await resp.json();
					setStore({ message: data.message });
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error);
				}
			},

		},
	};
};

export default getState;