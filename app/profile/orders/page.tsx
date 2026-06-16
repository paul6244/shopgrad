"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Filter, ChevronDown, ChevronUp, RefreshCw } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface Order {
  id: string
  date: string
  status: "delivered" | "shipped" | "processing" | "cancelled"
  total: number
  items: number
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [filterStatus, setFilterStatus] = useState<"all" | "delivered" | "shipped" | "processing" | "cancelled">("all")
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "total-desc" | "total-asc">("date-desc")
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      // Load orders from localStorage
      const storedOrders = localStorage.getItem(`orders-${user.id}`)
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders))
      }
    }
  }, [user])

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "shipped":
        return <Package className="h-5 w-5 text-blue-500" />
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700"
      case "shipped":
        return "bg-blue-100 text-blue-700"
      case "processing":
        return "bg-yellow-100 text-yellow-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true
    return order.status === filterStatus
  })

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "total-desc":
        return b.total - a.total
      case "total-asc":
        return a.total - b.total
      default:
        return 0
    }
  })

  const handleReorder = (orderId: string) => {
    // In a real app, this would add items back to cart
    console.log("Reorder:", orderId)
  }

  const handleTrackOrder = (orderId: string) => {
    // In a real app, this would open tracking details
    console.log("Track order:", orderId)
  }

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ]

  const sortOptions = [
    { value: "date-desc", label: "Newest First" },
    { value: "date-asc", label: "Oldest First" },
    { value: "total-desc", label: "Highest Total" },
    { value: "total-asc", label: "Lowest Total" },
  ]

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-200 via-rose-300 to-purple-500">
      <div className="px-6 py-4">
        <Link href="/profile" className="inline-flex items-center text-black">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Profile
        </Link>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">My Orders</h1>
            <p className="text-white text-sm opacity-90">{orders.length} total orders</p>
          </div>
          <button
            onClick={() => {
              if (user) {
                const storedOrders = localStorage.getItem(`orders-${user.id}`)
                if (storedOrders) {
                  setOrders(JSON.parse(storedOrders))
                }
              }
            }}
            className="flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white bg-opacity-90 rounded-xl p-8 text-center">
            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              When you place orders, they will appear here. Start shopping to see your order history.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Filters and Sort */}
            <div className="bg-white bg-opacity-90 rounded-xl p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter by Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Orders List */}
            {sortedOrders.length === 0 ? (
              <div className="bg-white bg-opacity-90 rounded-xl p-8 text-center">
                <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">No orders found</h2>
                <p className="text-gray-600 mb-6">
                  Try changing your filter or sort options to see more orders.
                </p>
                <button
                  onClick={() => {
                    setFilterStatus("all")
                    setSortBy("date-desc")
                  }}
                  className="inline-flex items-center px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <div>
                          <h3 className="font-bold text-lg">Order #{order.id}</h3>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-2 capitalize">{order.status}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          {order.items} {order.items === 1 ? "item" : "items"}
                        </div>
                        <div className="font-bold text-lg">GHS {order.total.toFixed(2)}</div>
                      </div>

                      {/* Expandable Details */}
                      <div className="mt-4">
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className="flex items-center text-sm text-rose-500 hover:text-rose-600 transition-colors"
                        >
                          {expandedOrder === order.id ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              View Details
                            </>
                          )}
                        </button>

                        {expandedOrder === order.id && (
                          <div className="mt-4 pt-4 border-t space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Order Status</span>
                              <span className="font-medium capitalize">{order.status}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Order Date</span>
                              <span className="font-medium">{order.date}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Items</span>
                              <span className="font-medium">{order.items}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Total</span>
                              <span className="font-medium">${order.total.toFixed(2)}</span>
                            </div>
                            
                            {order.status !== "cancelled" && (
                              <div className="flex gap-2 pt-2">
                                <button
                                  onClick={() => handleTrackOrder(order.id)}
                                  className="flex-1 py-2 px-4 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors text-sm font-medium"
                                >
                                  Track Order
                                </button>
                                {order.status === "delivered" && (
                                  <button
                                    onClick={() => handleReorder(order.id)}
                                    className="flex-1 py-2 px-4 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors text-sm font-medium"
                                  >
                                    Reorder
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
