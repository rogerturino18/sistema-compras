import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Button } from '@/components/ui/button.jsx'
import { ShoppingCart, Package, Users, BarChart3, Calculator, QrCode, Clock, Settings, Plus, Edit, Trash2, Search, FileText, Factory, LogIn, Menu, X, DollarSign, ArrowLeft } from 'lucide-react'
import './App.css'

const API_BASE_URL = 'https://e5h6i7c09xqk.manus.space'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalCompras: 0,
    comprasPendentes: 0,
    valorTotal: 0,
    estoqueBaixo: 0
  })
  const [items, setItems] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [purchases, setPurchases] = useState([])
  const [salesOrders, setSalesOrders] = useState([])
  const [quotes, setQuotes] = useState([])
  const [productionOrders, setProductionOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSupplierFormOpen, setIsSupplierFormOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [isPurchaseFormOpen, setIsPurchaseFormOpen] = useState(false)
  const [editingPurchase, setEditingPurchase] = useState(null)
  const [isSalesOrderFormOpen, setIsSalesOrderFormOpen] = useState(false)
  const [editingSalesOrder, setEditingSalesOrder] = useState(null)
  const [isProductionFormOpen, setIsProductionFormOpen] = useState(false)
  const [editingProduction, setEditingProduction] = useState(null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScannerActive, setIsScannerActive] = useState(false)
  const [scanResult, setScanResult] = useState('')
  const [scanError, setScanError] = useState('')
  const [isClientFormOpen, setIsClientFormOpen] = useState(false)

  useEffect(() => {
    if (isLoggedIn) {
      loadItems()
      loadSuppliers()
      loadPurchases()
      loadSalesOrders()
      loadStats()
    }
  }, [isLoggedIn])

  const loadStats = async () => {
    try {
      const itemsResponse = await fetch(`${API_BASE_URL}/api/items`)
      const purchasesResponse = await fetch(`${API_BASE_URL}/api/purchases`)
      
      if (itemsResponse.ok && purchasesResponse.ok) {
        const itemsData = await itemsResponse.json()
        const purchasesData = await purchasesResponse.json()
        
        const totalCompras = purchasesData.length
        const comprasPendentes = purchasesData.filter(p => p.status?.name !== 'Entregue').length
        const valorTotal = purchasesData.reduce((sum, p) => sum + (p.total_value || 0), 0)
        const estoqueBaixo = itemsData.filter(i => i.stock_quantity < 10).length
        
        setStats({
          totalCompras,
          comprasPendentes,
          valorTotal,
          estoqueBaixo
        })
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const loadItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/items`)
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Erro ao carregar itens:', error)
    }
  }

  const loadSuppliers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/suppliers`)
      if (response.ok) {
        const data = await response.json()
        setSuppliers(data)
      }
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error)
    }
  }

  const loadPurchases = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/purchases`)
      if (response.ok) {
        const data = await response.json()
        setPurchases(data)
      }
    } catch (error) {
      console.error('Erro ao carregar compras:', error)
    }
  }

  const loadSalesOrders = async () => {
    try {
      // Simular carregamento de pedidos de vendas
      setSalesOrders([])
    } catch (error) {
      console.error('Erro ao carregar pedidos de vendas:', error)
    }
  }

  const [currentAdminPassword, setCurrentAdminPassword] = useState('admin123')

  const handleLogin = async (username, password) => {
    if (username === 'admin' && password === currentAdminPassword) {
      setUser({ username: 'admin', full_name: 'Administrador' })
      setIsLoggedIn(true)
      localStorage.setItem('token', 'demo-token')
    } else {
      alert(`Usuário ou senha incorretos. Use: admin / ${currentAdminPassword}`)
    }
  }

  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      alert('Por favor, preencha todos os campos')
      return
    }

    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem')
      return
    }

    if (newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setCurrentAdminPassword(newPassword)
    setNewPassword('')
    setConfirmPassword('')
    setIsEditUserDialogOpen(false)
    alert('Senha alterada com sucesso!')
  }

  // Função para buscar dados do CNPJ usando BrasilAPI
  const searchCNPJ = async (cnpj) => {
    try {
      // Remover caracteres especiais do CNPJ
      const cleanCNPJ = cnpj.replace(/[^\d]/g, '')
      
      if (cleanCNPJ.length !== 14) {
        console.log('CNPJ deve ter 14 dígitos')
        return null
      }

      console.log('Buscando CNPJ:', cleanCNPJ)

      // Usar a BrasilAPI para buscar dados reais do CNPJ
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCNPJ}`)
      
      if (!response.ok) {
        console.log('Erro na resposta da API:', response.status)
        return null
      }

      const data = await response.json()
      console.log('Dados recebidos da API:', data)
      
      // Mapear os dados da API para o formato esperado pelo sistema
      const mappedData = {
        name: data.razao_social || data.nome_fantasia || '',
        address: `${data.logradouro || ''} ${data.numero || ''} ${data.complemento || ''} - ${data.bairro || ''} - ${data.municipio || ''}/${data.uf || ''}`.trim().replace(/^- /, '').replace(/ - $/, ''),
        phone: data.ddd_telefone_1 || '',
        email: data.email || ''
      }
      
      console.log('Dados mapeados:', mappedData)
      return mappedData
    } catch (error) {
      console.error('Erro ao buscar CNPJ:', error)
      return null
    }
  }

  const startScanner = async () => {
    try {
      setScanError('')
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setScanError('Scanner não suportado neste navegador')
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      setIsScannerActive(true)
      
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop())
        setIsScannerActive(false)
        
        const mockResult = `ITEM-${Date.now()}`
        setScanResult(mockResult)
        alert(`QR Code escaneado: ${mockResult}`)
      }, 3000)

    } catch (error) {
      console.error('Erro ao acessar câmera:', error)
      setScanError('Erro ao acessar a câmera. Verifique as permissões.')
      setIsScannerActive(false)
    }
  }

  const stopScanner = () => {
    setIsScannerActive(false)
    setScanError('')
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const LoginForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
      e.preventDefault()
      handleLogin(username, password)
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img src="/logo.png" alt="SL Óleos" className="h-8 w-8" />
              <ShoppingCart className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Sistema de Compras</h1>
            </div>
            <CardTitle>Fazer Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Componente da Calculadora de Metais (agora será usado dentro da aba de itens)
  const MetalCalculator = () => {
    const [material, setMaterial] = useState("")
    const [diameter, setDiameter] = useState("")
    const [thickness, setThickness] = useState("")
    const [length, setLength] = useState("")
    const [width, setWidth] = useState("")
    const [quantity, setQuantity] = useState("")
    const [result, setResult] = useState(null)
    const [price, setPrice] = useState(null)

    const calculateWeight = () => {
      let calculatedWeight = 0
      if (material && quantity) {
        calculatedWeight = parseFloat(quantity) * 7.85
        if (diameter) {
          calculatedWeight = parseFloat(quantity) * Math.PI * Math.pow(parseFloat(diameter) / 2, 2) * 7.85 / 1000
        } else if (thickness && width && length) {
          calculatedWeight = parseFloat(quantity) * parseFloat(thickness) * parseFloat(width) * parseFloat(length) * 7.85 / 1000000
        }
      }
      setResult(calculatedWeight.toFixed(2))
      
      // Calcular preço estimado (R$ 8,50 por kg)
      const estimatedPrice = calculatedWeight * 8.50
      setPrice(estimatedPrice.toFixed(2))
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            Calculadora de Metais
          </CardTitle>
          <CardDescription>
            Calcule o peso e preço de materiais com base nas especificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="materialCalc">Material</Label>
            <Input
              id="materialCalc"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="Ex: Aço Carbono"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="diameterCalc">Diâmetro (mm)</Label>
              <Input
                id="diameterCalc"
                type="number"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="thicknessCalc">Espessura (mm)</Label>
              <Input
                id="thicknessCalc"
                type="number"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lengthCalc">Comprimento (mm)</Label>
              <Input
                id="lengthCalc"
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="widthCalc">Largura (mm)</Label>
              <Input
                id="widthCalc"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="quantityCalc">Quantidade</Label>
            <Input
              id="quantityCalc"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <Button onClick={calculateWeight} className="w-full">
            Calcular Peso e Preço
          </Button>
          {result && (
            <div className="space-y-2">
              <div className="text-lg font-bold">
                Peso Calculado: {result} kg
              </div>
              <div className="text-lg font-bold text-green-600">
                Preço Estimado: R$ {price}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Componente para cadastro de cliente com consulta automática de CNPJ
  const ClientForm = ({ onSave }) => {
    const [formData, setFormData] = useState({
      name: "",
      cnpj: "",
      address: "",
      phone: "",
      email: ""
    })
    const [isSearching, setIsSearching] = useState(false)

    const handleCNPJChange = async (cnpj) => {
      setFormData({...formData, cnpj})
      
      if (cnpj.replace(/[^\d]/g, '').length === 14) {
        setIsSearching(true)
        const data = await searchCNPJ(cnpj)
        
        if (data) {
          setFormData({
            ...formData,
            cnpj,
            name: data.name,
            address: data.address,
            phone: data.phone,
            email: data.email
          })
        }
        setIsSearching(false)
      }
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave(formData)
      setFormData({
        name: "",
        cnpj: "",
        address: "",
        phone: "",
        email: ""
      })
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            value={formData.cnpj}
            onChange={(e) => handleCNPJChange(e.target.value)}
            placeholder="00.000.000/0000-00"
            required
          />
          {isSearching && (
            <p className="text-sm text-muted-foreground mt-1">
              Buscando dados do CNPJ...
            </p>
          )}
        </div>
        
        <div>
          <Label htmlFor="clientName">Nome da Empresa</Label>
          <Input
            id="clientName"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="clientAddress">Endereço</Label>
          <Textarea
            id="clientAddress"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clientPhone">Telefone</Label>
            <Input
              id="clientPhone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="clientEmail">Email</Label>
            <Input
              id="clientEmail"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => setIsClientFormOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit">
            Salvar Cliente
          </Button>
        </div>
      </form>
    )
  }

  const ItemForm = ({ item, onSave }) => {
    const [formData, setFormData] = useState({
      name: item?.name || "",
      description: item?.description || "",
      material: item?.material || "",
      diameter_mm: item?.diameter_mm || "",
      thickness_mm: item?.thickness_mm || "",
      length_mm: item?.length_mm || "",
      width_mm: item?.width_mm || "",
      stock_quantity: item?.stock_quantity || 0,
      unit_price: item?.unit_price || 0,
      supplier_id: item?.supplier_id || ""
    })

    const handleSubmit = async (e) => {
      e.preventDefault()
      
      const newItem = {
        id: item?.id || Date.now(),
        ...formData
      }
      
      if (item) {
        setItems(items.map(i => i.id === item.id ? newItem : i))
      } else {
        setItems([...items, newItem])
      }
      
      alert('Item salvo com sucesso!')
      onSave()
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="material">Material</Label>
            <Input
              id="material"
              value={formData.material}
              onChange={(e) => setFormData({...formData, material: e.target.value})}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label htmlFor="diameter">Diâmetro (mm)</Label>
            <Input
              id="diameter"
              type="number"
              value={formData.diameter_mm}
              onChange={(e) => setFormData({...formData, diameter_mm: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="thickness">Espessura (mm)</Label>
            <Input
              id="thickness"
              type="number"
              value={formData.thickness_mm}
              onChange={(e) => setFormData({...formData, thickness_mm: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="length">Comprimento (mm)</Label>
            <Input
              id="length"
              type="number"
              value={formData.length_mm}
              onChange={(e) => setFormData({...formData, length_mm: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="width">Largura (mm)</Label>
            <Input
              id="width"
              type="number"
              value={formData.width_mm}
              onChange={(e) => setFormData({...formData, width_mm: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="stock">Estoque</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value) || 0})}
            />
          </div>
          <div>
            <Label htmlFor="price">Preço Unitário</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.unit_price}
              onChange={(e) => setFormData({...formData, unit_price: parseFloat(e.target.value) || 0})}
            />
          </div>
          <div>
            <Label htmlFor="supplier">Fornecedor</Label>
            <Select value={formData.supplier_id} onValueChange={(value) => setFormData({...formData, supplier_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um fornecedor" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id.toString()}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit">
            {item ? 'Atualizar' : 'Criar'} Item
          </Button>
        </div>
      </form>
    )
  }

  const Dashboard = () => {
    return (
      <div className="relative z-10 space-y-6 bg-background">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral do sistema de compras e vendas
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Compras</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchases.length}</div>
              <p className="text-xs text-muted-foreground">
                Compras registradas no sistema
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos de Vendas</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                Pedidos de vendas registrados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total Vendas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(salesOrders.reduce((sum, s) => sum + (s.total_value || 0), 0))}</div>
              <p className="text-xs text-muted-foreground">
                Valor total das vendas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{items.filter(i => i.stock_quantity < 10).length}</div>
              <p className="text-xs text-muted-foreground">
                Itens precisam reposição
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Compras Recentes</CardTitle>
              <CardDescription>
                Últimas compras realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {purchases.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma compra registrada ainda</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Comece cadastrando sua primeira compra
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {purchases.slice(0, 5).map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{purchase.supplier?.name || 'Fornecedor'}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(purchase.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {formatCurrency(purchase.total_value || 0)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pedidos de Vendas Recentes</CardTitle>
              <CardDescription>
                Últimos pedidos de vendas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {salesOrders.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum pedido de venda registrado</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Comece cadastrando seu primeiro pedido
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {salesOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{order.client_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {formatCurrency(order.total_value || 0)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const ItemsManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Itens</h2>
          <p className="text-muted-foreground">
            Cadastre e gerencie itens, materiais e produtos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar Item' : 'Novo Item'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Edite as informações do item' : 'Adicione um novo item ao sistema'}
              </DialogDescription>
            </DialogHeader>
            <ItemForm 
              item={editingItem} 
              onSave={() => {
                setIsDialogOpen(false)
                setEditingItem(null)
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Itens</CardTitle>
              <CardDescription>
                Todos os itens cadastrados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum item cadastrado</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Comece adicionando seu primeiro item.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true) }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Cadastrar Primeiro Item
                    </Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.material}</TableCell>
                        <TableCell>
                          <Badge variant={item.stock_quantity < 10 ? "destructive" : "secondary"}>
                            {item.stock_quantity}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingItem(item)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setItems(items.filter(i => i.id !== item.id))
                                alert('Item removido com sucesso!')
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <MetalCalculator />
        </div>
      </div>
    </div>
  )

  const SuppliersManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Fornecedores</h2>
          <p className="text-muted-foreground">
            Cadastre e gerencie seus fornecedores
          </p>
        </div>
        <Dialog open={isSupplierFormOpen} onOpenChange={setIsSupplierFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingSupplier(null); setIsSupplierFormOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Fornecedor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}</DialogTitle>
              <DialogDescription>
                {editingSupplier ? 'Edite as informações do fornecedor' : 'Adicione um novo fornecedor ao sistema'}
              </DialogDescription>
            </DialogHeader>
            <SupplierForm 
              supplier={editingSupplier} 
              onSave={() => {
                setIsSupplierFormOpen(false)
                setEditingSupplier(null)
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
          <CardDescription>
            Todos os fornecedores cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {suppliers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum fornecedor cadastrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Comece adicionando seu primeiro fornecedor.
              </p>
              <div className="mt-6">
                <Button onClick={() => { setEditingSupplier(null); setIsSupplierFormOpen(true) }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Primeiro Fornecedor
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.cnpj}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingSupplier(supplier)
                            setIsSupplierFormOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSuppliers(suppliers.filter(s => s.id !== supplier.id))
                            alert('Fornecedor removido com sucesso!')
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const SupplierForm = ({ supplier, onSave }) => {
    const [cnpj, setCnpj] = useState(supplier?.cnpj || "")
    const [supplierData, setSupplierData] = useState(null)
    const [isSearching, setIsSearching] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const handleCNPJChange = async (e) => {
      const value = e.target.value
      setCnpj(value)
      
      // Buscar automaticamente quando CNPJ tiver 14 dígitos
      const cleanCNPJ = value.replace(/[^\d]/g, '')
      if (cleanCNPJ.length === 14) {
        await handleSearch()
      }
    }

    const handleCNPJBlur = async () => {
      if (cnpj && cnpj.replace(/[^\d]/g, '').length === 14) {
        await handleSearch()
      }
    }

    const handleSearch = async () => {
      if (!cnpj || cnpj.replace(/[^\d]/g, '').length !== 14) {
        alert('Por favor, digite um CNPJ válido com 14 dígitos')
        return
      }

      setIsSearching(true)
      const data = await searchCNPJ(cnpj)
      
      if (data) {
        setSupplierData({
          cnpj,
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email
        })
        setShowForm(true)
      } else {
        alert('CNPJ não encontrado. Verifique o número digitado.')
      }
      setIsSearching(false)
    }

    const handleSave = () => {
      if (!supplierData) return

      const newSupplier = {
        id: supplier?.id || Date.now(),
        ...supplierData
      }
      
      if (supplier) {
        setSuppliers(suppliers.map(s => s.id === supplier.id ? newSupplier : s))
      } else {
        setSuppliers([...suppliers, newSupplier])
      }
      
      alert('Fornecedor salvo com sucesso!')
      onSave()
    }

    const handleBack = () => {
      setShowForm(false)
      setSupplierData(null)
    }

    if (showForm && supplierData) {
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold text-red-500">Incluir Fornecedor</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={supplierData.cnpj}
                onChange={(e) => setSupplierData({...supplierData, cnpj: e.target.value})}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="supplierName">Nome da Empresa</Label>
              <Input
                id="supplierName"
                value={supplierData.name}
                onChange={(e) => setSupplierData({...supplierData, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="supplierAddress">Endereço</Label>
              <Textarea
                id="supplierAddress"
                value={supplierData.address}
                onChange={(e) => setSupplierData({...supplierData, address: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supplierPhone">Telefone</Label>
                <Input
                  id="supplierPhone"
                  value={supplierData.phone}
                  onChange={(e) => setSupplierData({...supplierData, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="supplierEmail">Email</Label>
                <Input
                  id="supplierEmail"
                  type="email"
                  value={supplierData.email}
                  onChange={(e) => setSupplierData({...supplierData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleBack}>
                Voltar
              </Button>
              <Button onClick={handleSave}>
                Salvar Fornecedor
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Button variant="ghost" size="sm" onClick={() => setIsSupplierFormOpen(false)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold text-red-500">Incluir Fornecedor</h3>
        </div>
        
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Informe o CNPJ ou CPF para pesquisa na Receita Federal
          </p>
          
          <div className="max-w-md mx-auto relative">
            <Input
              value={cnpj}
              onChange={handleCNPJChange}
              onBlur={handleCNPJBlur}
              placeholder="00.000.000/0000-00"
              className="text-center pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <Button 
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-red-500 hover:bg-red-600 text-white px-8"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Pesquisando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Pesquisar
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  const PurchasesManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Compras</h2>
          <p className="text-muted-foreground">
            Registre e acompanhe suas compras
          </p>
        </div>
        <Dialog open={isPurchaseFormOpen} onOpenChange={setIsPurchaseFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingPurchase(null); setIsPurchaseFormOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Compra
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPurchase ? 'Editar Compra' : 'Nova Compra'}</DialogTitle>
              <DialogDescription>
                {editingPurchase ? 'Edite as informações da compra' : 'Registre uma nova compra no sistema'}
              </DialogDescription>
            </DialogHeader>
            <PurchaseForm 
              purchase={editingPurchase} 
              onSave={() => {
                setIsPurchaseFormOpen(false)
                setEditingPurchase(null)
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Compras</CardTitle>
          <CardDescription>
            Todas as compras registradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma compra registrada</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Comece registrando sua primeira compra.
              </p>
              <div className="mt-6">
                <Button onClick={() => { setEditingPurchase(null); setIsPurchaseFormOpen(true) }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Primeira Compra
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">{purchase.supplier?.name || 'Fornecedor'}</TableCell>
                    <TableCell>{new Date(purchase.created_at).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{formatCurrency(purchase.total_value || 0)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {purchase.status?.name || 'Pendente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPurchase(purchase)
                            setIsPurchaseFormOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPurchases(purchases.filter(p => p.id !== purchase.id))
                            alert('Compra removida com sucesso!')
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const PurchaseForm = ({ purchase, onSave }) => {
    const [formData, setFormData] = useState({
      supplier_id: purchase?.supplier_id || "",
      total_value: purchase?.total_value || 0,
      status: purchase?.status?.name || "Pendente",
      notes: purchase?.notes || ""
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      
      const newPurchase = {
        id: purchase?.id || Date.now(),
        ...formData,
        created_at: purchase?.created_at || new Date().toISOString(),
        supplier: suppliers.find(s => s.id.toString() === formData.supplier_id),
        status: { name: formData.status }
      }
      
      if (purchase) {
        setPurchases(purchases.map(p => p.id === purchase.id ? newPurchase : p))
      } else {
        setPurchases([...purchases, newPurchase])
      }
      
      alert('Compra salva com sucesso!')
      onSave()
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="purchaseSupplier">Fornecedor</Label>
          <Select value={formData.supplier_id} onValueChange={(value) => setFormData({...formData, supplier_id: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um fornecedor" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id.toString()}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="purchaseValue">Valor Total</Label>
          <Input
            id="purchaseValue"
            type="number"
            step="0.01"
            value={formData.total_value}
            onChange={(e) => setFormData({...formData, total_value: parseFloat(e.target.value) || 0})}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="purchaseStatus">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Aprovado">Aprovado</SelectItem>
              <SelectItem value="Em Trânsito">Em Trânsito</SelectItem>
              <SelectItem value="Entregue">Entregue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="purchaseNotes">Observações</Label>
          <Textarea
            id="purchaseNotes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => setIsPurchaseFormOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit">
            {purchase ? 'Atualizar' : 'Criar'} Compra
          </Button>
        </div>
      </form>
    )
  }

  const SalesOrdersManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Pedidos de Vendas</h2>
          <p className="text-muted-foreground">
            Registre e acompanhe pedidos de vendas dos clientes
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isClientFormOpen} onOpenChange={setIsClientFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Cliente</DialogTitle>
                <DialogDescription>
                  Cadastre um novo cliente com consulta automática de CNPJ
                </DialogDescription>
              </DialogHeader>
              <ClientForm 
                onSave={(clientData) => {
                  alert('Cliente cadastrado com sucesso!')
                  setIsClientFormOpen(false)
                }} 
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isSalesOrderFormOpen} onOpenChange={setIsSalesOrderFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingSalesOrder(null); setIsSalesOrderFormOpen(true) }}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Pedido
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingSalesOrder ? 'Editar Pedido' : 'Novo Pedido de Venda'}</DialogTitle>
                <DialogDescription>
                  {editingSalesOrder ? 'Edite as informações do pedido' : 'Registre um novo pedido de venda'}
                </DialogDescription>
              </DialogHeader>
              <SalesOrderForm 
                salesOrder={editingSalesOrder} 
                onSave={() => {
                  setIsSalesOrderFormOpen(false)
                  setEditingSalesOrder(null)
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos de Vendas</CardTitle>
          <CardDescription>
            Todos os pedidos de vendas registrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {salesOrders.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum pedido de venda registrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Comece registrando seu primeiro pedido de venda.
              </p>
              <div className="mt-6">
                <Button onClick={() => { setEditingSalesOrder(null); setIsSalesOrderFormOpen(true) }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Pedido
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Equipamento</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.client_name}</TableCell>
                    <TableCell>{order.equipment_name}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{formatCurrency(order.total_value || 0)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingSalesOrder(order)
                            setIsSalesOrderFormOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSalesOrders(salesOrders.filter(s => s.id !== order.id))
                            alert('Pedido removido com sucesso!')
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const SalesOrderForm = ({ salesOrder, onSave }) => {
    const [formData, setFormData] = useState({
      client_name: salesOrder?.client_name || "",
      client_cnpj: salesOrder?.client_cnpj || "",
      equipment_name: salesOrder?.equipment_name || "",
      equipment_model: salesOrder?.equipment_model || "",
      drawing_number: salesOrder?.drawing_number || "",
      quantity: salesOrder?.quantity || 1,
      unit_price: salesOrder?.unit_price || 0,
      delivery_date: salesOrder?.delivery_date || "",
      status: salesOrder?.status || "Pendente",
      notes: salesOrder?.notes || ""
    })

    const totalValue = formData.quantity * formData.unit_price

    const handleSubmit = (e) => {
      e.preventDefault()
      
      const newSalesOrder = {
        id: salesOrder?.id || Date.now(),
        ...formData,
        total_value: totalValue,
        created_at: salesOrder?.created_at || new Date().toISOString()
      }
      
      if (salesOrder) {
        setSalesOrders(salesOrders.map(s => s.id === salesOrder.id ? newSalesOrder : s))
      } else {
        setSalesOrders([...salesOrders, newSalesOrder])
      }
      
      alert('Pedido de venda salvo com sucesso!')
      onSave()
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input
              id="clientName"
              value={formData.client_name}
              onChange={(e) => setFormData({...formData, client_name: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="clientCnpj">CNPJ do Cliente</Label>
            <Input
              id="clientCnpj"
              value={formData.client_cnpj}
              onChange={(e) => setFormData({...formData, client_cnpj: e.target.value})}
              placeholder="00.000.000/0000-00"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="equipmentName">Nome do Equipamento</Label>
            <Input
              id="equipmentName"
              value={formData.equipment_name}
              onChange={(e) => setFormData({...formData, equipment_name: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="equipmentModel">Modelo</Label>
            <Input
              id="equipmentModel"
              value={formData.equipment_model}
              onChange={(e) => setFormData({...formData, equipment_model: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="drawingNumber">Número do Desenho</Label>
            <Input
              id="drawingNumber"
              value={formData.drawing_number}
              onChange={(e) => setFormData({...formData, drawing_number: e.target.value})}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
              required
            />
          </div>
          <div>
            <Label htmlFor="unitPrice">Preço Unitário</Label>
            <Input
              id="unitPrice"
              type="number"
              step="0.01"
              value={formData.unit_price}
              onChange={(e) => setFormData({...formData, unit_price: parseFloat(e.target.value) || 0})}
              required
            />
          </div>
          <div>
            <Label htmlFor="totalValue">Valor Total</Label>
            <Input
              id="totalValue"
              value={formatCurrency(totalValue)}
              disabled
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="deliveryDate">Data de Entrega</Label>
            <Input
              id="deliveryDate"
              type="date"
              value={formData.delivery_date}
              onChange={(e) => setFormData({...formData, delivery_date: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="orderStatus">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Em Produção">Em Produção</SelectItem>
                <SelectItem value="Entregue">Entregue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="orderNotes">Observações</Label>
          <Textarea
            id="orderNotes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => setIsSalesOrderFormOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit">
            {salesOrder ? 'Atualizar' : 'Criar'} Pedido
          </Button>
        </div>
      </form>
    )
  }

  const MobileScanner = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Scanner Mobile</h2>
        <p className="text-muted-foreground">
          Escaneie códigos QR para operações rápidas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="mr-2 h-5 w-5" />
            Scanner de QR Code
          </CardTitle>
          <CardDescription>
            Use a câmera do dispositivo para escanear códigos QR
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            {!isScannerActive ? (
              <Button onClick={startScanner} className="w-full">
                <QrCode className="mr-2 h-4 w-4" />
                Iniciar Scanner
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="text-lg font-medium">Scanner ativo...</div>
                <div className="text-sm text-muted-foreground">
                  Aponte a câmera para o código QR
                </div>
                <Button onClick={stopScanner} variant="outline" className="w-full">
                  Parar Scanner
                </Button>
              </div>
            )}
          </div>
          
          {scanError && (
            <div className="text-red-600 text-sm text-center">
              {scanError}
            </div>
          )}
          
          {scanResult && (
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Último resultado:</div>
              <div className="font-medium">{scanResult}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Package className="mr-2 h-4 w-4" />
              Receber Material
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Clock className="mr-2 h-4 w-4" />
              Mover Estoque
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Expedir Material
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Search className="mr-2 h-4 w-4" />
              Inventário
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Operações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Nenhuma operação registrada ainda.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const ProductionOrdersManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Ordens de Produção</h2>
          <p className="text-muted-foreground">
            Controle e acompanhamento de ordens de produção
          </p>
        </div>
        <Dialog open={isProductionFormOpen} onOpenChange={setIsProductionFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingProduction(null); setIsProductionFormOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Ordem
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProduction ? 'Editar Ordem' : 'Nova Ordem de Produção'}</DialogTitle>
              <DialogDescription>
                {editingProduction ? 'Edite as informações da ordem' : 'Crie uma nova ordem de produção'}
              </DialogDescription>
            </DialogHeader>
            <ProductionOrderForm 
              productionOrder={editingProduction} 
              onSave={() => {
                setIsProductionFormOpen(false)
                setEditingProduction(null)
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ordens de Produção</CardTitle>
          <CardDescription>
            Todas as ordens de produção registradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {productionOrders.length === 0 ? (
            <div className="text-center py-8">
              <Factory className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma ordem de produção</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Comece criando sua primeira ordem de produção.
              </p>
              <div className="mt-6">
                <Button onClick={() => { setEditingProduction(null); setIsProductionFormOpen(true) }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Ordem
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productionOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>{order.product_name}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(order.due_date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingProduction(order)
                            setIsProductionFormOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setProductionOrders(productionOrders.filter(p => p.id !== order.id))
                            alert('Ordem removida com sucesso!')
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const ProductionOrderForm = ({ productionOrder, onSave }) => {
    const [formData, setFormData] = useState({
      order_number: productionOrder?.order_number || `OP-${Date.now()}`,
      product_name: productionOrder?.product_name || "",
      quantity: productionOrder?.quantity || 1,
      due_date: productionOrder?.due_date || "",
      status: productionOrder?.status || "Planejada",
      notes: productionOrder?.notes || ""
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      
      const newProductionOrder = {
        id: productionOrder?.id || Date.now(),
        ...formData,
        created_at: productionOrder?.created_at || new Date().toISOString()
      }
      
      if (productionOrder) {
        setProductionOrders(productionOrders.map(p => p.id === productionOrder.id ? newProductionOrder : p))
      } else {
        setProductionOrders([...productionOrders, newProductionOrder])
      }
      
      alert('Ordem de produção salva com sucesso!')
      onSave()
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="orderNumber">Número da Ordem</Label>
            <Input
              id="orderNumber"
              value={formData.order_number}
              onChange={(e) => setFormData({...formData, order_number: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="productName">Nome do Produto</Label>
            <Input
              id="productName"
              value={formData.product_name}
              onChange={(e) => setFormData({...formData, product_name: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
              required
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Data de Entrega</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({...formData, due_date: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planejada">Planejada</SelectItem>
                <SelectItem value="Em Produção">Em Produção</SelectItem>
                <SelectItem value="Pausada">Pausada</SelectItem>
                <SelectItem value="Concluída">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => setIsProductionFormOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit">
            {productionOrder ? 'Atualizar' : 'Criar'} Ordem
          </Button>
        </div>
      </form>
    )
  }

  const Settings = () => {
    return (
      <div className="relative z-20 w-full h-full bg-background p-4 space-y-6" style={{position: 'relative', zIndex: 1000}}>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Configurações do sistema e gerenciamento de usuários
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Usuários do Sistema</CardTitle>
              <CardDescription>
                Gerenciar usuários e permissões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Administrador</p>
                    <p className="text-sm text-muted-foreground">admin</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditUserDialogOpen(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações da Empresa</CardTitle>
              <CardDescription>
                Informações da empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input id="companyName" defaultValue="SL Óleos" />
                </div>
                <div>
                  <Label htmlFor="companyCnpj">CNPJ</Label>
                  <Input id="companyCnpj" placeholder="00.000.000/0000-00" />
                </div>
                <Button>Salvar Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogDescription>
                Altere a senha do usuário administrador
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite a nova senha"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme a nova senha"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleChangePassword}>
                  Alterar Senha
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  const renderContent = () => {
    // Garantir que apenas o conteúdo da aba ativa seja renderizado
    if (activeTab === 'dashboard') {
      return <Dashboard />
    } else if (activeTab === 'items') {
      return <ItemsManagement />
    } else if (activeTab === 'suppliers') {
      return <SuppliersManagement />
    } else if (activeTab === 'purchases') {
      return <PurchasesManagement />
    } else if (activeTab === 'sales') {
      return <SalesOrdersManagement />
    } else if (activeTab === 'scanner') {
      return <MobileScanner />
    } else if (activeTab === 'production') {
      return <ProductionOrdersManagement />
    } else if (activeTab === 'settings') {
      return <Settings />
    } else {
      return <Dashboard />
    }
  }

  if (!isLoggedIn) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="SL Óleos" className="h-6 w-6" />
            <ShoppingCart className="h-6 w-6" />
            <h1 className="text-xl font-bold">Sistema de Compras</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <span className="text-sm text-muted-foreground hidden md:inline">
              Bem-vindo, {user?.full_name}
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 min-h-screen`}>
          <nav className="space-y-2 p-4">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'items', label: 'Itens', icon: Package },
              { id: 'suppliers', label: 'Fornecedores', icon: Users },
              { id: 'purchases', label: 'Compras', icon: ShoppingCart },
              { id: 'sales', label: 'Pedidos de Vendas', icon: DollarSign },
              { id: 'scanner', label: 'Scanner', icon: QrCode },
              { id: 'production', label: 'Produção', icon: Factory },
              { id: 'settings', label: 'Configurações', icon: Settings },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-3 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App

