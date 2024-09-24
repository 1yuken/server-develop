# LAB 1
# Создать классы на основании приведенных ниже спецификаций. Определить конструкторы и соответствующие методы (геттеры — getters и сеттеры — setter) setTun(), getTun(). 
# Переопределить методы toString() и hashCode() с целью дальнейшего сравнения нескольких объектов класса. Определить дополнительно методы в классе, создающем массив объектов.
# Задать критерий выбора данных и вывести эти данные на консоль. В каждом классе, обладающем информацией, должно быть объявлено несколько конструкторов.

# 2. Customer: id, Фамилия, Имя, Отчество, Адрес, Номер кредитной карточки, Номер банковского счета.
# Создать массив объектов. Вывести:
# a) список покупателей в алфавитном порядке;
# b) список покупателей, у которых номер кредитной карточки находится в заданном интервале.

from typing import List


class Customer:
    def __init__(self, id, surname, name, patronymic, address, credit_card_number, bank_account_number):
        self._id = id
        self._surname = surname
        self._name = name
        self._patronymic = patronymic
        self._address = address
        self._credit_card_number = credit_card_number
        self._bank_account_number = bank_account_number

    # Геттеры и сеттеры
    def get_id(self): return self._id
    def set_id(self, id): self._id = id

    def get_surname(self): return self._surname
    def set_surname(self, surname): self._surname = surname

    def get_name(self): return self._name
    def set_name(self, name): self._name = name

    def get_patronymic(self): return self._patronymic
    def set_patronymic(self, patronymic): self._patronymic = patronymic

    def get_address(self): return self._address
    def set_address(self, address): self._address = address

    def get_credit_card_number(self): return self._credit_card_number
    def set_credit_card_number(self, credit_card_number): self._credit_card_number = credit_card_number

    def get_bank_account_number(self): return self._bank_account_number
    def set_bank_account_number(self, bank_account_number): self._bank_account_number = bank_account_number

    def __str__(self):
        return f"Customer(id={self._id}, name={self._surname} {self._name} {self._patronymic}, credit_card_number={self._credit_card_number})"

    def __hash__(self):
        return hash((self._id, self._surname, self._name, self._patronymic, self._address, self._credit_card_number, self._bank_account_number))


class CustomerManager:
    def __init__(self):
        self.customers = []

    def add_customer(self, customer):
        self.customers.append(customer)

    def get_customers_sorted_by_name(self):
        return sorted(self.customers, key=lambda c: (c.get_surname(), c.get_name(), c.get_patronymic()))

    def get_customers_by_credit_card_range(self, min_credit_card, max_credit_card):
        return [c for c in self.customers if min_credit_card <= c.get_credit_card_number() <= max_credit_card]


# Пример использования
if __name__ == "__main__":
    manager = CustomerManager()

    # Создание нескольких покупателей
    customers = [
        Customer(1, "Иванов", "Иван", "Иванович", "г. Москва, ул. Ленина, 1", 1234567890123456, "40817810000000000001"),
        Customer(2, "Петров", "Петр", "Петрович", "г. Санкт-Петербург, ул. Кирова, 12", 2345678901234567, "40817810000000000002"),
        Customer(3, "Сидоров", "Семен", "Семенович", "г. Новосибирск, ул. Карла Маркса, 45", 3456789012345678, "40817810000000000003"),
        Customer(4, "Александров", "Александр", "Александрович", "г. Екатеринбург, ул. Победы, 78", 4567890123456789, "40817810000000000004"),
        Customer(5, "Кузнецов", "Кузьма", "Кузьмич", "г. Казань, ул. Труда, 23", 5678901234567890, "40817810000000000005")
    ]

    # Добавление покупателей в менеджер
    for customer in customers:
        manager.add_customer(customer)

    # Вывод результатов
    print("Список покупателей в алфавитном порядке:")
    for customer in manager.get_customers_sorted_by_name():
        print(customer)

    print("\nСписок покупателей с номерами кредитных карт в интервале [2000000000000000, 4000000000000000]:")
    for customer in manager.get_customers_by_credit_card_range(2000000000000000, 4000000000000000):
        print(customer)