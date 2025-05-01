<?php
    require_once 'BaseService.php';
    require_once 'dao/PaymentDao.php';
    class PaymentService extends BaseService{
        private $paymentDao;

        public function __construct() {
            $this->paymentDao = new PaymentDao();
            parent::__construct($this->paymentDao);
        }

        public function getByOrderId($orderId) {
            return $this->paymentDao->getByOrderId($orderId);
        }

        public function getByPaymentId($paymentId) {
            return $this->paymentDao->getByPaymentId($paymentId);
        }

        public function processPayment($orderId, $amount, $paymentMethod, $cardDetails) {
            if ($paymentMethod === 'credit-card') {
                $validationResult = $this->validateCreditCard($cardDetails);
                if (!$validationResult['success']) {
                    return $validationResult;
                }
            }
            
            return ['success' => true];
        }

        private function validateCreditCard($cardDetails) {
            $errors = [];
            
            // Validate card number
            if (!preg_match('/^\d{16}$/', $cardDetails['cardNumber'])) {
                $errors[] = 'Card number must be 16 digits';
            }

            // Validate expiry date
            if (!$this->isValidExpiryDate($cardDetails['expiryDate'])) {
                $errors[] = 'Invalid expiry date';
            }

            // Validate CVC
            if (!preg_match('/^\d{3}$/', $cardDetails['cvc'])) {
                $errors[] = 'CVC must be 3 digits';
            }

            if (!empty($errors)) {
                return [
                    'success' => false,
                    'errors' => $errors
                ];
            }

            return ['success' => true];
        }

        private function isValidExpiryDate($expiryDate) {
            if (!preg_match('/^(0[1-9]|1[0-2])\/([0-9]{2})$/', $expiryDate, $matches)) {
                return false;
            }

            $month = $matches[1];
            $year = '20' . $matches[2];
            $currentYear = date('Y');
            $currentMonth = date('m');

            if ($year < $currentYear) {
                return false;
            }

            if ($year == $currentYear && $month < $currentMonth) {
                return false;
            }

            return true;
        }
    }
?>