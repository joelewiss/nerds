/// Custom macro for printing test results
macro_rules! log_custom {
    // 3 arguments: test string, expected, actual
    ($msg:expr, $expected:expr, $actual:expr) => {
        println!("TEST FAILED: {}", $msg);
        println!("\t{:<12}{:?}","Expected:", $expected);
        println!("\t{:<12}{:?}", "Actual:", $actual);
    };

    // 5 arguments: test_string, expected value, actual value, expected list, result list
    ($msg:expr, $expected_val:expr, $actual_val:expr, $expected_list:expr, $actual_list:expr) => {
        println!("TEST FAILED: {}", $msg);
        println!("\t{:<12}{:?}","Expected val:", $expected_val);
        println!("\t{:<12}{:?}", "Actual val:", $actual_val);
        println!("\t{:<12}{:?}","Expected list:", $expected_list);
        println!("\t{:<12}{:?}", "Actual list:", $actual_list);
    };

    // fallback for invalid usage
    ($($arg:tt)*) => {
        compile_error!("log_custom! expects 2 (msg, Result), 3, or 5 arguments.");
    };
}





#[allow(unused_imports)]
use crate::{LinkedList, LinkedListNode};

impl LinkedList {
    /// Put item onto the front of the linked list
    fn push_front(&mut self, item: i32) {
        // Take the value from head, construct new node with old head as next
        let next = self.head.take();
        self.head = Some(Box::new(LinkedListNode { val: item, next } ));
    }

    fn from_slice(s: &[i32]) -> Self {
        let mut l = Self::new();
        for val in s.iter().rev() {
            l.push_front(*val);
        }
        return l
    }

    /// Utility for testing so I can use vec comparison
    pub fn as_vec(&self) -> Vec<i32> {
        let mut ret = vec![];
        let mut node = &self.head;
        loop {
            match &node {
                None => return ret,
                Some(n) => {
                    ret.push(n.val);
                    node = &n.next;
                }
            }
        }
    }
}


pub fn run_tests() {
    let results = vec![
        insert_empty_list_tests(),
        insert_head_tests(),
        insert_tail_tests(),
        insert_mid_tests(),
        insert_out_of_bounds_tests()
    ];

    println!();
    for result in results {
        println!("{result}");
    }
}



fn insert_empty_list_tests() -> &'static str {
    println!("\n{}", format!("{:-^100}", " RUNNING insert_empty_list_tests TESTS "));
    let mut all_passed = true;

    let mut l = LinkedList::from_slice(&[]);
    let expected = vec![5];
    let result = l.insert(5, 0);
    if result.is_err() {
        log_custom!("[].insert(5, 0)", expected, result);
        all_passed = false;
    } else if l.as_vec() != expected {
        log_custom!("[].insert(5, 0)", expected, l.as_vec());
        all_passed = false;
    }


    let mut l = LinkedList::new();
    let expected = vec![-3];
    let result = l.insert(-3, 0);
    if result.is_err() {
        log_custom!("[].insert(-3, 0)", expected, result);
        all_passed = false;
    } else if l.as_vec() != expected {
        log_custom!("[].insert(-3, 0)", expected, l.as_vec());
        all_passed = false;
    }

    let mut l = LinkedList::new();
    let result = l.insert(42, 1);
    if result.is_ok() {
        log_custom!("[].insert(42, 1)", "Err, got Ok", l.as_vec());
        all_passed = false;
    }

    let mut l = LinkedList::new();
    let result = l.insert(99, 10);
    if result.is_ok() {
        log_custom!("[].insert(99, 10)", "Err, got Ok", l.as_vec());
        all_passed = false;
    }

    println!("Finished");
    if all_passed {
        "insert_empty_list_tests: PASSED"
    } else {
        "insert_empty_list_tests: FAILED"
    }
}


fn insert_head_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING insert_head_tests TESTS "));
    let mut all_passed = true;

    let mut l = LinkedList::from_slice(&[]);
    let result = l.insert(1, 0);
    let expected = vec![1];
    if result.is_err() {
        log_custom!("[].insert(1, 0)", expected, result);
        all_passed = false;
    } else if l.as_vec() != expected {
        log_custom!("[].insert(1, 0)", expected, l.as_vec());
        all_passed = false;
    }

    let mut l = LinkedList::from_slice(&[1]);
    let result = l.insert(2, 0);
    let expected = vec![2, 1];
    if result.is_err() {
        log_custom!("[1].insert(2, 0)", expected, result);
        all_passed = false;
    } else if l.as_vec() != expected {
        log_custom!("[1].insert(2, 0)", expected, l.as_vec());
        all_passed = false;
    }

    let mut l = LinkedList::from_slice(&[2, 1]);
    let result = l.insert(5, 0);
    let expected = vec![5, 2, 1];
    if result.is_err() {
        log_custom!("[2, 1].insert(5, 0)", expected, result);
        all_passed = false;
    } else if l.as_vec() != expected {
        log_custom!("[2, 1].insert(5, 0)", expected, l.as_vec());
        all_passed = false;
    }

    println!("Finished");
    if all_passed {
        "insert_head_tests: PASSED"
    } else {
        "insert_head_tests: FAILED"
    }
}



fn insert_tail_tests() -> &'static str {
    println!("\n{}", format!("{:-^100}", " RUNNING insert_tail_tests TESTS "));
    let mut all_passed = true;

    let mut l = LinkedList::from_slice(&[3]);
    let result = l.insert(2, 1);
    let expected = vec![3, 2];
    if result.is_err() {
        log_custom!("[3].insert(2, 1)", expected, result);
        all_passed = false;
    } else if l.as_vec() != expected {
        log_custom!("[3].insert(2, 1)", expected, l.as_vec());
        all_passed = false;
    }

    let mut l = LinkedList::from_slice(&[3, 2]);
    let result = l.insert(1, 2);
    let expected = vec![3, 2, 1];
    if result.is_err() {
        log_custom!("[3, 2].insert(1, 2)", expected, result);
        all_passed = false;
    } else if l.as_vec() != expected {
        log_custom!("[3, 2].insert(1, 2)", expected, l.as_vec());
        all_passed = false;
    }


    println!("Finished");
    if all_passed {
        "insert_tail_tests: PASSED"
    } else {
        "insert_tail_tests: FAILED"
    }
}



fn insert_mid_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING insert_mid_tests TESTS "));
    let mut all_passed = true;


    let mut l = LinkedList::from_slice(&[1, 2, 3]);
    let result = l.insert(10, 2);
    let expected = vec![1, 2, 10, 3];
    if result.is_err() {
        log_custom!("[1, 2, 3].insert(10, 2)", expected, result);
        all_passed = false;
    } else if l.as_vec() != expected {
        log_custom!("[1, 2, 3].insert(10, 2)", expected, l.as_vec());
        all_passed = false;
    }

    let mut l = LinkedList::from_slice(&[1, 2, 3]);
    let result = l.insert(10, 1);
    let expected = vec![1, 10, 2, 3];
    if result.is_err() {
        log_custom!("[1, 2, 3].insert(10, 1)", expected, result);
        all_passed = false;
    } else if l.as_vec() != expected {
        log_custom!("[1, 2, 3].insert(10, 1)", expected, l.as_vec());
        all_passed = false;
    }

    println!("Finished");
    if all_passed {
        "insert_mid_tests: PASSED"
    } else {
        "insert_mid_tests: FAILED"
    }
}


fn insert_out_of_bounds_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING insert_out_of_bounds_tests TESTS "));
    let mut all_passed = true;


    let mut l = LinkedList::from_slice(&[1]);

    let result = l.insert(2, 2); // invalid index
    if result.is_ok() {
        log_custom!("[1].insert(2, 2)", "Err, got Ok", l.as_vec());
        all_passed = false;
    }

    let mut l = LinkedList::from_slice(&[1]);
    let result = l.insert(5, 100); // invalid index
    if result.is_ok() {
        log_custom!("[1].insert(2, 100)", "Err, got Ok", l.as_vec());
        all_passed = false;
    }

    println!("Finished");
    if all_passed {
        "insert_out_of_bounds_tests: PASSED"
    } else {
        "insert_out_of_bounds_tests: FAILED"
    }
}
