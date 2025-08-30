"use client"

import { useState, useEffect, useCallback } from 'react'

// Definir tipos para MetaMask
interface MetaMaskError {
  code: number
  message: string
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
    }
  }
}

export function useMetaMask() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // Configuración de Sepolia Testnet
  const SEPOLIA_CONFIG = {
    chainId: '0xaa36a7', // 11155111 in hex
    chainName: 'Sepolia Test Network',
    nativeCurrency: {
      name: 'SepoliaETH',
      symbol: 'SepoliaETH',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://sepolia.etherscan.io/'],
  }

  // Verificar si MetaMask está instalado
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask)
  }, [])

  // Cambiar a red Sepolia
  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) return false

    try {
      // Intentar cambiar a Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CONFIG.chainId }],
      })
      return true
    } catch (switchError: any) {
      // Si la red no existe, agregarla
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SEPOLIA_CONFIG],
          })
          return true
        } catch (addError: any) {
          console.error('Error adding Sepolia network:', addError)
          setError('Error agregando red Sepolia: ' + addError.message)
          return false
        }
      } else {
        console.error('Error switching to Sepolia:', switchError)
        setError('Error cambiando a red Sepolia: ' + switchError.message)
        return false
      }
    }
  }, [])

  // Conectar wallet
  const connect = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask no está instalado. Por favor instálalo desde metamask.io')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Cambiar a Sepolia primero
      const switchedNetwork = await switchToSepolia()
      if (!switchedNetwork) {
        setIsLoading(false)
        return
      }

      // Solicitar conexión de cuentas
      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length > 0) {
        setAccount(accounts[0])
        setIsConnected(true)
      }
    } catch (err: any) {
      console.error('Error connecting to MetaMask:', err)
      if (err.code === 4001) {
        setError('Conexión rechazada por el usuario')
      } else {
        setError('Error conectando a MetaMask: ' + err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [isMetaMaskInstalled, switchToSepolia])

  // Desconectar wallet
  const disconnect = useCallback(() => {
    setIsConnected(false)
    setAccount('')
    setError('')
  }, [])

  // Verificar conexión existente al cargar
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return

      try {
        const accounts = await window.ethereum!.request({
          method: 'eth_accounts',
        })

        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
        }
      } catch (err) {
        console.error('Error checking connection:', err)
      }
    }

    checkConnection()
  }, [isMetaMaskInstalled])

  // Escuchar cambios de cuenta
  useEffect(() => {
    if (!isMetaMaskInstalled()) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0])
        setIsConnected(true)
      } else {
        setAccount('')
        setIsConnected(false)
      }
    }

    const handleChainChanged = () => {
      // Recargar la página cuando cambie la red
      window.location.reload()
    }

    window.ethereum!.on('accountsChanged', handleAccountsChanged)
    window.ethereum!.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum!.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum!.removeListener('chainChanged', handleChainChanged)
    }
  }, [isMetaMaskInstalled])

  return {
    isConnected,
    account,
    isLoading,
    error,
    connect,
    disconnect,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  }
}
