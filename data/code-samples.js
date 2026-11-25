"use strict";

// Multi-line code for the Code symbols focus: "@@ <language> <title>" starts each sample.
// String.raw keeps backslashes as written; a backtick is ${"`"} and a dollar-brace is ${"${"}.
const codeSampleText = String.raw`
@@ py FizzBuzz
for n in range(1, 101):
    if n % 15 == 0:
        print("FizzBuzz")
    elif n % 3 == 0:
        print("Fizz")
    elif n % 5 == 0:
        print("Buzz")
    else:
        print(n)
@@ py Palindrome check
def is_palindrome(s: str) -> bool:
    cleaned = [c.lower() for c in s if c.isalnum()]
    return cleaned == cleaned[::-1]

print(is_palindrome("A man, a plan, a canal: Panama"))
@@ py Fibonacci generator
def fibonacci(limit):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b

print(list(fibonacci(100)))
@@ py Binary search
def binary_search(items, target):
    lo, hi = 0, len(items) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
@@ py Stack class
class Stack:
    def __init__(self):
        self._items = []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        return self._items.pop() if self._items else None
@@ py Word count
from collections import Counter

def top_words(text, n=3):
    words = [w.strip(".,!?").lower() for w in text.split()]
    return Counter(words).most_common(n)
@@ py Timing decorator
import time

def timed(fn):
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = fn(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{fn.__name__}: {elapsed:.3f}s")
        return result
    return wrapper
@@ py Load a config file
import json
from pathlib import Path

def load_config(path="config.json"):
    file = Path(path)
    if not file.exists():
        return {}
    with file.open() as f:
        return json.load(f)
@@ java Hello, world
public class Main {
    public static void main(String[] args) {
        String name = args.length > 0 ? args[0] : "world";
        System.out.printf("Hello, %s!%n", name);
    }
}
@@ java Reverse the words
static String reverseWords(String s) {
    String[] words = s.trim().split("\\s+");
    Collections.reverse(Arrays.asList(words));
    return String.join(" ", words);
}
@@ java Adults with streams
List<String> names = people.stream()
        .filter(p -> p.getAge() >= 18)
        .map(Person::getName)
        .sorted()
        .collect(Collectors.toList());
@@ java Interface and record
interface Shape {
    double area();
}

record Circle(double r) implements Shape {
    public double area() { return Math.PI * r * r; }
}
@@ java Recursive factorial
static long factorial(int n) {
    if (n < 0) {
        throw new IllegalArgumentException("n < 0: " + n);
    }
    return n <= 1 ? 1 : n * factorial(n - 1);
}
@@ java Letter frequency
Map<Character, Integer> freq = new HashMap<>();
for (char c : text.toCharArray()) {
    if (Character.isLetter(c)) {
        freq.merge(c, 1, Integer::sum);
    }
}
@@ cs FizzBuzz
for (int i = 1; i <= 100; i++)
{
    string text = "";
    if (i % 3 == 0) text += "Fizz";
    if (i % 5 == 0) text += "Buzz";
    Console.WriteLine(text.Length > 0 ? text : i.ToString());
}
@@ cs LINQ query
var adults = people
    .Where(p => p.Age >= 18)
    .OrderBy(p => p.Name)
    .Select(p => $"{p.Name} ({p.Age})")
    .ToList();
@@ cs Record and switch
public record Shape(string Kind, double Size);

static double Area(Shape s) => s.Kind switch
{
    "square" => s.Size * s.Size,
    "circle" => Math.PI * s.Size * s.Size,
    _ => throw new ArgumentException(s.Kind)
};
@@ cs Bank account
public class Account
{
    public string Owner { get; }
    public decimal Balance { get; private set; }

    public Account(string owner) => Owner = owner;

    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("amount");
        Balance += amount;
    }
}
@@ cs Count lines async
static async Task<int> CountLinesAsync(string path)
{
    var lines = await File.ReadAllLinesAsync(path);
    return lines.Count(l => !string.IsNullOrWhiteSpace(l));
}
@@ cs Word count
var counts = new Dictionary<string, int>();
foreach (var word in text.ToLower().Split(' '))
{
    counts[word] = counts.GetValueOrDefault(word) + 1;
}
@@ c Swap with pointers
#include <stdio.h>

void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}
@@ c Reverse a string
#include <string.h>

void reverse(char *s) {
    size_t n = strlen(s);
    for (size_t i = 0; i < n / 2; i++) {
        char c = s[i];
        s[i] = s[n - 1 - i];
        s[n - 1 - i] = c;
    }
}
@@ c Prime check
int is_prime(int n) {
    if (n < 2) return 0;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return 0;
    }
    return 1;
}
@@ c Linked list push
typedef struct Node {
    int value;
    struct Node *next;
} Node;

Node *push(Node *head, int value) {
    Node *node = malloc(sizeof(Node));
    node->value = value;
    node->next = head;
    return node;
}
@@ c Bubble sort
void bubble_sort(int *a, int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                int t = a[j];
                a[j] = a[j + 1];
                a[j + 1] = t;
            }
        }
    }
}
@@ c Command-line arguments
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s <n>\n", argv[0]);
        return 1;
    }
    printf("%d\n", atoi(argv[1]) * 2);
    return 0;
}
@@ cpp Sum a vector
#include <iostream>
#include <numeric>
#include <vector>

int main() {
    std::vector<int> nums{4, 8, 15, 16, 23, 42};
    int total = std::accumulate(nums.begin(), nums.end(), 0);
    std::cout << "sum = " << total << '\n';
}
@@ cpp Rectangle class
class Rectangle {
public:
    Rectangle(double w, double h) : w_(w), h_(h) {}
    double area() const { return w_ * h_; }

private:
    double w_, h_;
};
@@ cpp Count words with a map
std::map<std::string, int> count_words(std::istream &in) {
    std::map<std::string, int> counts;
    std::string word;
    while (in >> word) {
        ++counts[word];
    }
    return counts;
}
@@ cpp Template maximum
template <typename T>
T max_of(const std::vector<T> &items) {
    T best = items.front();
    for (const auto &item : items) {
        if (item > best) best = item;
    }
    return best;
}
@@ cpp Sort with a lambda
std::vector<std::pair<std::string, int>> people{
    {"Ada", 36}, {"Linus", 28}, {"Grace", 45}};
std::sort(people.begin(), people.end(),
          [](const auto &a, const auto &b) {
              return a.second < b.second;
          });
@@ cpp Smart pointers
#include <memory>

struct Node {
    int value;
    std::unique_ptr<Node> next;
};

auto head = std::make_unique<Node>(Node{1, nullptr});
@@ rs FizzBuzz
fn main() {
    for n in 1..=100 {
        match (n % 3, n % 5) {
            (0, 0) => println!("FizzBuzz"),
            (0, _) => println!("Fizz"),
            (_, 0) => println!("Buzz"),
            _ => println!("{n}"),
        }
    }
}
@@ rs Match on ranges
fn describe(n: i32) -> &'static str {
    match n {
        i32::MIN..=-1 => "negative",
        0 => "zero",
        1..=9 => "small",
        _ => "large",
    }
}
@@ rs Point distance
#[derive(Debug, Clone)]
struct Point { x: f64, y: f64 }

impl Point {
    fn dist(&self, other: &Point) -> f64 {
        let (dx, dy) = (self.x - other.x, self.y - other.y);
        (dx * dx + dy * dy).sqrt()
    }
}
@@ rs Count lines
use std::fs;
use std::io;

fn count_lines(path: &str) -> io::Result<usize> {
    let text = fs::read_to_string(path)?;
    Ok(text.lines().filter(|l| !l.trim().is_empty()).count())
}
@@ rs Iterator chain
let total: i64 = (1..=10)
    .filter(|n| n % 2 == 0)
    .map(|n| n * n)
    .sum();
println!("sum of even squares: {total}");
@@ rs Traits
trait Area {
    fn area(&self) -> f64;
}

struct Square(f64);

impl Area for Square {
    fn area(&self) -> f64 { self.0 * self.0 }
}
@@ go FizzBuzz
func main() {
    for i := 1; i <= 100; i++ {
        switch {
        case i%15 == 0:
            fmt.Println("FizzBuzz")
        case i%3 == 0:
            fmt.Println("Fizz")
        case i%5 == 0:
            fmt.Println("Buzz")
        default:
            fmt.Println(i)
        }
    }
}
@@ go Read lines
func readLines(path string) ([]string, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("read %s: %w", path, err)
    }
    return strings.Split(string(data), "\n"), nil
}
@@ go Struct and method
type Rect struct {
    W, H float64
}

func (r Rect) Area() float64 {
    return r.W * r.H
}
@@ go Goroutines and a channel
results := make(chan int, len(jobs))
for _, job := range jobs {
    go func(n int) {
        results <- n * n
    }(job)
}
for range jobs {
    fmt.Println(<-results)
}
@@ go HTTP handler
func health(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    if r.Method != http.MethodGet {
        http.Error(w, "method not allowed", 405)
        return
    }
    fmt.Fprintf(w, ${"`"}{"status": "ok"}${"`"})
}
@@ go Word count
counts := map[string]int{}
for _, word := range strings.Fields(text) {
    counts[strings.ToLower(word)]++
}
@@ js Debounce
function debounce(fn, wait = 200) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
@@ js Fetch JSON
async function getUser(id) {
  const res = await fetch(${"`"}/api/users/${"${"}id}${"`"});
  if (!res.ok) throw new Error(${"`"}HTTP ${"${"}res.status}${"`"});
  return res.json();
}
@@ js Cart total
const total = cart
  .filter((item) => item.qty > 0)
  .map(({ price, qty }) => price * qty)
  .reduce((sum, n) => sum + n, 0);
@@ ts Result type
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function parsePort(input: string): Result<number> {
  const port = Number(input);
  if (!Number.isInteger(port) || port < 1) {
    return { ok: false, error: ${"`"}bad port: ${"${"}input}${"`"} };
  }
  return { ok: true, value: port };
}
@@ sql Orders per user
SELECT u.name, COUNT(o.id) AS orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.name
HAVING COUNT(o.id) > 2
ORDER BY orders DESC;
@@ sql Create a table
CREATE TABLE notes (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT DEFAULT '',
  updated_at TIMESTAMP
);
@@ html Sign-in form
<form action="/login" method="post">
  <label for="email">Email</label>
  <input id="email" type="email" required>
  <button type="submit">Sign in</button>
</form>
@@ css Card styles
.card {
  display: grid;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
}

.card:hover > .title { color: #5536d6; }
@@ sh Back up notes
#!/usr/bin/env bash
set -euo pipefail

for f in ~/notes/*.md; do
  cp "$f" "/tmp/backup/$(basename "$f")"
done
echo "done: $(ls /tmp/backup | wc -l) files"
@@ sh Recent fixes
git log --oneline --since="2 weeks ago" \
  | grep -i "fix" \
  | head -n 5
git diff --stat HEAD~3..HEAD -- src/
@@ json Package manifest
{
  "name": "notes-app",
  "version": "1.2.0",
  "scripts": {
    "dev": "vite",
    "test": "vitest --run"
  },
  "dependencies": { "zod": "^3.22.0" }
}
@@ yaml CI workflow
name: test
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test
  `;
